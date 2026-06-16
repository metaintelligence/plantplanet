# HanGarden Redirect Site

이 폴더는 `hangarden.github.io` 같은 정적 GitHub Pages 저장소에 그대로 올려서 사용할 수 있는 리디렉션 페이지입니다.

## 사용 방법

1. `redirect-target.json`의 `targetUrl` 값을 현재 `trycloudflare.com` 주소로 수정합니다.
2. `index.html`, `redirect-target.json` 파일을 GitHub Pages 저장소 루트에 반영합니다.
3. commit / push 합니다.

## 예시

```json
{
  "targetUrl": "https://abc123.trycloudflare.com"
}
```

그 뒤 `https://hangarden.github.io`에 접속하면 최신 Cloudflare Tunnel 주소로 이동합니다.

## 주의

- 이 방식은 **고정 진입 주소**를 제공하지만, 최종적으로는 브라우저 주소창이 `trycloudflare.com` 주소로 바뀝니다.
- `targetUrl`은 tunnel이 바뀔 때마다 다시 갱신해야 합니다.
