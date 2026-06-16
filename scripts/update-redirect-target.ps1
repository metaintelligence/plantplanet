param(
  [Parameter(Mandatory = $true)]
  [string]$TargetUrl
)

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path (Join-Path $scriptDir '..')
$targetFiles = @(
  (Join-Path $rootDir 'redirect-site\redirect-target.json'),
  (Join-Path $rootDir 'hangarden\redirect-target.json')
)

if (-not ($TargetUrl -match '^https://')) {
  throw 'TargetUrl must start with https://'
}

$payload = @{
  targetUrl = $TargetUrl.Trim()
} | ConvertTo-Json

foreach ($targetFile in $targetFiles) {
  if (Test-Path (Split-Path -Parent $targetFile)) {
    Set-Content -Path $targetFile -Value $payload -Encoding UTF8
    Write-Host "Updated redirect target: $TargetUrl" -ForegroundColor Green
    Write-Host "File: $targetFile"
  }
}
