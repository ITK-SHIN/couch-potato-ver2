# 문의 폼 이메일 설정 (Resend)

문의하기 제출 시 **bano112@naver.com** 으로 메일이 전송됩니다.

## 1. Resend 가입

1. [https://resend.com](https://resend.com) 가입
2. **API Keys** → Create API Key → 복사

## 2. 로컬 `.env`

```env
RESEND_API_KEY=re_xxxx
CONTACT_TO_EMAIL=bano112@naver.com
CONTACT_FROM_EMAIL=COUCHPOTATO <onboarding@resend.dev>
```

- `npm run dev` 재시작 후 문의 폼 테스트

## 3. Vercel (배포 사이트)

**Settings → Environment Variables** 에 동일하게 추가:

| Name | Value |
|------|--------|
| `RESEND_API_KEY` | Resend API 키 |
| `CONTACT_TO_EMAIL` | `bano112@naver.com` |
| `CONTACT_FROM_EMAIL` | (선택) 발신 주소 |

> `VITE_` 접두사 **없음** — 서버 API 전용입니다.

저장 후 **Redeploy** 하세요.

## 4. IP 기반 남용 방지 (기본 적용)

같은 IP에서 문의를 연속·대량으로 보내는 것을 막습니다.

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `CONTACT_RATE_LIMIT_COOLDOWN_SEC` | `60` | 두 번째 제출까지 최소 대기(초) |
| `CONTACT_RATE_LIMIT_MAX` | `5` | 윈도우당 최대 제출 횟수 |
| `CONTACT_RATE_LIMIT_WINDOW_MIN` | `60` | 횟수 제한 윈도우(분) |

초과 시 HTTP **429** 와 함께 “잠시 후 다시 시도” 메시지가 표시됩니다.  
Vercel 서버리스는 인스턴스별 메모리를 쓰므로, 아주 강한 봇 차단까지는 Vercel Firewall·Upstash 등 추가가 필요할 수 있습니다. 일반적인 연속 클릭·스크립트 남용에는 충분합니다.

## 5. 발신 주소 (도메인) 안내

- 처음에는 `onboarding@resend.dev` 로 테스트 가능 (Resend 무료 플랜 제한 있음)
- 실제 운영 시 [Resend Domains](https://resend.com/domains) 에서 도메인 인증 후  
  `CONTACT_FROM_EMAIL=COUCHPOTATO <noreply@yourdomain.com>` 로 변경 권장

## 문제 해결

| 증상 | 해결 |
|------|------|
| API 키 없음 오류 | `.env` / Vercel에 `RESEND_API_KEY` 추가 |
| 로컬에서만 실패 | `npm run dev` 재시작 |
| 배포에서만 실패 | Vercel env + Redeploy |
| Resend 도메인 오류 | `CONTACT_FROM_EMAIL` 을 인증된 도메인으로 변경 |
| “요청이 너무 빠릅니다” / 횟수 제한 | 정상 동작(429). 1분 후 재시도 |
