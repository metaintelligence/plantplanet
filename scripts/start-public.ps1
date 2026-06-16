$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path (Join-Path $scriptDir '..')
Set-Location $rootDir

function Test-PortAvailable([int]$candidatePort) {
  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $candidatePort)
    $listener.Start()
    $listener.Stop()
    return $true
  } catch {
    return $false
  }
}

function Resolve-ServerPort {
  if ($env:PORT) {
    $requestedPort = [int]$env:PORT
    if (-not (Test-PortAvailable $requestedPort)) {
      throw "Requested PORT $requestedPort is already in use."
    }

    return $requestedPort
  }

  foreach ($candidate in 4000..4100) {
    if (Test-PortAvailable $candidate) {
      return $candidate
    }
  }

  throw 'No available port found in range 4000-4100.'
}

$port = Resolve-ServerPort
$env:HOST = '0.0.0.0'
$env:PORT = "$port"

$backendProcess = $null
$tunnelProcess = $null
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("hangarden-public-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tempDir | Out-Null
$backendOutPath = Join-Path $tempDir 'backend.out.log'
$backendErrPath = Join-Path $tempDir 'backend.err.log'
$tunnelOutPath = Join-Path $tempDir 'tunnel.out.log'
$tunnelErrPath = Join-Path $tempDir 'tunnel.err.log'
$cloudflaredDir = Join-Path $rootDir '.tools\cloudflared'
$cloudflaredPath = Join-Path $cloudflaredDir 'cloudflared.exe'
$hangardenRepoDir = Join-Path $rootDir 'hangarden'
$hangardenRedirectTargetPath = Join-Path $hangardenRepoDir 'redirect-target.json'

function Stop-ManagedProcess($process, [string]$name) {
  if ($null -eq $process) {
    return
  }

  try {
    if (-not $process.HasExited) {
      Write-Host "Stopping $name..." -ForegroundColor DarkYellow
      $process.Kill($true)
      $process.WaitForExit(5000) | Out-Null
    }
  } catch {
  }
}

function Start-LoggedProcess(
  [string]$fileName,
  [string]$arguments,
  [string]$workingDirectory,
  [string]$stdoutPath,
  [string]$stderrPath
) {
  return Start-Process `
    -FilePath $fileName `
    -ArgumentList $arguments `
    -WorkingDirectory $workingDirectory `
    -RedirectStandardOutput $stdoutPath `
    -RedirectStandardError $stderrPath `
    -NoNewWindow `
    -PassThru
}

function Read-LogText([string[]]$paths) {
  $chunks = @()
  foreach ($path in $paths) {
    if (Test-Path $path) {
      $text = Get-Content $path -Raw -ErrorAction SilentlyContinue
      if ($text) {
        $chunks += $text
      }
    }
  }

  return ($chunks -join "`n")
}

function Ensure-Cloudflared([string]$binaryPath) {
  if (Test-Path $binaryPath) {
    return $binaryPath
  }

  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $binaryPath) | Out-Null

  $downloadUrl = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe'
  Write-Host ''
  Write-Host 'Downloading cloudflared for public tunnel...' -ForegroundColor Cyan
  Write-Host "  $downloadUrl" -ForegroundColor DarkGray

  Invoke-WebRequest -Uri $downloadUrl -OutFile $binaryPath

  if (-not (Test-Path $binaryPath)) {
    throw 'cloudflared download failed.'
  }

  return $binaryPath
}

function Update-RedirectTargetFile([string]$targetFile, [string]$targetUrl) {
  if (-not (Test-Path $targetFile)) {
    throw "Redirect target file was not found: $targetFile"
  }

  $payload = Get-Content $targetFile -Raw | ConvertFrom-Json
  $payload.targetUrl = $targetUrl.Trim()
  $nextJson = $payload | ConvertTo-Json
  Set-Content -Path $targetFile -Value $nextJson -Encoding UTF8
}

function Publish-HangardenRedirect([string]$repoDir, [string]$targetFile, [string]$targetUrl) {
  if (-not (Test-Path (Join-Path $repoDir '.git'))) {
    throw "hangarden repository was not found: $repoDir"
  }

  Update-RedirectTargetFile $targetFile $targetUrl

  $statusOutput = git -C $repoDir status --short -- redirect-target.json
  if (-not $statusOutput) {
    Write-Host '   Redirect target is already up to date. Skipping commit/push.' -ForegroundColor DarkYellow
    return
  }

  git -C $repoDir add redirect-target.json
  if ($LASTEXITCODE -ne 0) {
    throw 'Failed to stage hangarden redirect-target.json'
  }

  git -C $repoDir commit -m "Update redirect target to $targetUrl"
  if ($LASTEXITCODE -ne 0) {
    throw 'Failed to commit hangarden redirect target update'
  }

  git -C $repoDir push origin main
  if ($LASTEXITCODE -ne 0) {
    throw 'Failed to push hangarden redirect target update'
  }
}

function Wait-ForHealth([string]$url, [int]$timeoutSeconds) {
  $deadline = (Get-Date).AddSeconds($timeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 3
      if ($response.ok -eq $true) {
        return $true
      }
    } catch {
    }

    Start-Sleep -Milliseconds 500
  }

  return $false
}

function Wait-ForTunnelUrl([string[]]$logPaths, [System.Diagnostics.Process]$process, [int]$timeoutSeconds) {
  $deadline = (Get-Date).AddSeconds($timeoutSeconds)
  $patterns = @(
    '(https://[a-zA-Z0-9.-]+\.trycloudflare\.com\S*)',
    '(https://[a-zA-Z0-9.-]+\.loca\.lt\S*)',
    'your url is:\s*(https?://\S+)'
  )

  while ((Get-Date) -lt $deadline) {
    $content = Read-LogText $logPaths
    foreach ($pattern in $patterns) {
      if ($content -match $pattern) {
        return $Matches[1]
      }
    }

    if ($process.HasExited) {
      break
    }

    Start-Sleep -Milliseconds 500
  }

  return $null
}

try {
  Write-Host ''
  Write-Host '== HanGarden public server bootstrap ==' -ForegroundColor Green
  Write-Host "workspace: $rootDir"
  Write-Host "host: $($env:HOST)"
  Write-Host "port: $port"
  if ($port -ne 4000) {
    Write-Host "note: default port 4000 was busy, so port $port will be used instead." -ForegroundColor Yellow
  }
  Write-Host ''
  Write-Host '1) Building frontend + backend...' -ForegroundColor Cyan

  npm run build

  if ($LASTEXITCODE -ne 0) {
    throw "Build failed with exit code $LASTEXITCODE."
  }

  Write-Host ''
  Write-Host '2) Starting backend server...' -ForegroundColor Cyan
  $backendProcess = Start-LoggedProcess 'cmd.exe' '/c npm run start -w backend' $rootDir $backendOutPath $backendErrPath

  if (-not (Wait-ForHealth "http://127.0.0.1:$port/api/health" 30)) {
    $backendLog = Read-LogText @($backendOutPath, $backendErrPath)
    throw "Backend server did not become ready. Log:`n$backendLog"
  }

  if ($backendProcess.HasExited) {
    $backendLog = Read-LogText @($backendOutPath, $backendErrPath)
    throw "Backend server exited unexpectedly after startup.`n$backendLog"
  }

  Write-Host '   Backend is healthy.' -ForegroundColor Green
  Write-Host ''
  Write-Host '3) Opening public tunnel with Cloudflare Quick Tunnel...' -ForegroundColor Cyan
  Write-Host '   This may take a few seconds on first run.' -ForegroundColor Yellow

  $cloudflaredExecutable = Ensure-Cloudflared $cloudflaredPath
  $tunnelArgs = "tunnel --url http://127.0.0.1:$port --no-autoupdate"
  $tunnelProcess = Start-LoggedProcess $cloudflaredExecutable $tunnelArgs $rootDir $tunnelOutPath $tunnelErrPath

  $publicUrl = Wait-ForTunnelUrl @($tunnelOutPath, $tunnelErrPath) $tunnelProcess 45
  if (-not $publicUrl) {
    $tunnelLog = Read-LogText @($tunnelOutPath, $tunnelErrPath)
    throw "Public tunnel URL was not created. Log:`n$tunnelLog"
  }

  Write-Host ''
  Write-Host 'Public URL:' -ForegroundColor Green
  Write-Host "  $publicUrl" -ForegroundColor White
  Write-Host ''
  Write-Host '4) Updating hangarden redirect repository...' -ForegroundColor Cyan
  Publish-HangardenRedirect $hangardenRepoDir $hangardenRedirectTargetPath $publicUrl
  Write-Host '   hangarden redirect-target.json committed and pushed.' -ForegroundColor Green
  Write-Host '   GitHub Pages may take a short time to reflect the new target URL.' -ForegroundColor Yellow
  Write-Host ''
  Write-Host 'Keep this window open. Closing it will stop both the server and the public tunnel.' -ForegroundColor Yellow
  Write-Host ''

  while ($true) {
    if ($backendProcess.HasExited) {
      $backendLog = Read-LogText @($backendOutPath, $backendErrPath)
      throw "Backend server exited unexpectedly.`n$backendLog"
    }

    if ($tunnelProcess.HasExited) {
      $tunnelLog = Read-LogText @($tunnelOutPath, $tunnelErrPath)
      throw "Public tunnel exited unexpectedly.`n$tunnelLog"
    }

    Start-Sleep -Seconds 1
  }
} catch {
  Write-Host ''
  Write-Host 'Public server startup failed.' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red

  $backendLog = Read-LogText @($backendOutPath, $backendErrPath)
  if ($backendLog) {
    Write-Host ''
    Write-Host 'Backend log:' -ForegroundColor Yellow
    Write-Host $backendLog
  }

  $tunnelLog = Read-LogText @($tunnelOutPath, $tunnelErrPath)
  if ($tunnelLog) {
    Write-Host ''
    Write-Host 'Tunnel log:' -ForegroundColor Yellow
    Write-Host $tunnelLog
  }

  exit 1
} finally {
  Stop-ManagedProcess $tunnelProcess 'public tunnel'
  Stop-ManagedProcess $backendProcess 'backend server'
  Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
