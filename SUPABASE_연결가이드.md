# Supabase 연결 가이드 (처음부터)

이 가이드대로 하면 **Vercel에 배포된 사이트**에서도 관리자가 수정한 내용이 **모든 방문자**에게 보입니다.

---

## 준비물

- [Supabase](https://supabase.com) 계정 (무료 플랜 가능)
- [Vercel](https://vercel.com)에 연결된 이 프로젝트

예상 소요: **15~20분**

---

## 1단계: Supabase 프로젝트 만들기

1. [https://supabase.com/dashboard](https://supabase.com/dashboard) 로그인
2. **New project** 클릭
3. 이름 예: `couch-potato` / 비밀번호(DB) 설정 / 리전 **Northeast Asia (Seoul)** 권장
4. 프로젝트가 **Active** 될 때까지 1~2분 대기

---

## 2단계: API 키 복사

1. 왼쪽 **Project Settings** (톱니바퀴) → **API**
2. 아래 두 값을 메모장에 복사

| 항목 | 사용처 |
|------|--------|
| **Project URL** | `VITE_SUPABASE_URL` |
| **anon public** 키 | `VITE_SUPABASE_ANON_KEY` |

> `service_role` 키는 **절대** 프론트엔드·GitHub에 넣지 마세요.

---

## 3단계: DB + Storage SQL 실행

1. 왼쪽 **SQL Editor** → **New query**
2. 이 저장소의 `supabase/schema.sql` **전체**를 붙여넣기
3. **Run** 클릭 → Success 확인

포함 내용:

- `site_content` 테이블 (사이트 JSON 저장)
- RLS: 누구나 읽기 / 로그인 사용자만 저장
- `media` 버킷 + 이미지 public 읽기

---

## 4단계: 관리자 계정 만들기

1. 왼쪽 **Authentication** → **Users**
2. **Add user** → **Create new user**
3. 운영용 이메일·비밀번호 입력 (본인만 쓸 계정 1개)
4. **Auto Confirm User** 켜기 (이메일 인증 생략)

---

## 5단계: 로컬 `.env` 설정

프로젝트 루트에 `.env` 파일 생성 (`.env.example` 참고):

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

1. 터미널에서 프로젝트 폴더로 이동
2. `npm run dev` **다시 시작** (환경 변수는 재시작 후 적용)
3. `http://localhost:5173/admin/login` 접속
4. **이메일 + 비밀번호**로 로그인 (Supabase 연결 시 단순 비밀번호 모드는 사용 안 함)
5. 내용 수정 → **저장하기** → 시크릿 창에서 `/` 열어 동일 내용인지 확인

---

## 6단계: Vercel 환경 변수 (배포 사이트)

1. [Vercel Dashboard](https://vercel.com) → 이 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 아래 두 개 추가 (Production, Preview, Development 모두 체크 권장)

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | 2단계 Project URL |
| `VITE_SUPABASE_ANON_KEY` | 2단계 anon key |

4. **Deployments** → 최신 배포 **⋯** → **Redeploy** (환경 변수 반영)

재배포 후:

- `https://your-domain.vercel.app/admin/login` → 이메일 로그인
- 저장한 내용이 **다른 기기·다른 브라우저**에서도 `/` 에 보여야 함

---

## 동작 확인 체크리스트

- [ ] `/admin/login`에 **이메일/비밀번호** 폼이 보임 (단순 비밀번호만 보이면 env 미적용)
- [ ] 저장 시 토스트 "저장되었습니다" 표시
- [ ] Supabase **Table Editor** → `site_content` → `content` JSON이 채워짐
- [ ] 시크릿 창 `/` 에서 수정 내용 표시
- [ ] 관리자에서 이미지 업로드 시 URL이 `supabase.co/storage/...` 형태

---

## 자주 하는 실수

| 증상 | 원인 | 해결 |
|------|------|------|
| 로그인 `Failed to fetch` / CORS (localhost→vercel.app) | `VITE_SUPABASE_URL`에 **배포 URL**을 넣음 | Supabase **Project URL** (`https://xxxx.supabase.co`)로 수정 후 dev 재시작 |
| `ERR_NAME_NOT_RESOLVED` | Project URL **오타** (anon 키의 `ref`와 불일치) | 대시보드 API의 URL을 그대로 복사·붙여넣기 후 dev 재시작 |
| 여전히 비밀번호만 로그인 | Vercel/local에 env 없음 | `.env` 또는 Vercel env 추가 후 **dev 서버·재배포** |
| 저장 실패 / RLS 오류 | SQL 미실행 또는 로그인 안 됨 | `schema.sql` 실행, `/admin` 로그인 상태 확인 |
| 다른 사람만 예전 내용 | 배포 env 없음 | Vercel에 `VITE_*` 추가 후 Redeploy |
| 이미지 업로드 실패 | `media` 버킷·정책 없음 | `schema.sql` Storage 부분 다시 실행 |

---

## (선택) 기존 localStorage 내용을 DB로 옮기기

1. 관리자에서 원하는 대로 수정 후 **저장하기** 한 번만 누르면 Supabase `site_content`에 저장됩니다.
2. 또는 브라우저 개발자 도구 → Application → Local Storage → `couchpotato-site-content` JSON을 Supabase Table Editor에 수동 붙여넣기 (`content` 컬럼).

---

## (선택) SEO·검색 노출 (Vercel Environment Variables)

| 변수 | 설명 |
|------|------|
| `VITE_SITE_URL` | 배포 URL (예: `https://xxx.vercel.app`) — OG·canonical |
| `VITE_ALLOW_INDEXING` | `false`면 noindex (스테이징). 미설정 시 **검색 허용** |

관리자 **히어로** 탭 하단 **검색·SNS (SEO)** 에서 제목·설명을 직접 입력할 수 있습니다. **저장·공개 반영** 후에만 방문자·검색엔진에 반영됩니다.

---

## 요약

```
관리자 편집 → 로컬 초안 (미리보기만)
저장·공개 반영 → Supabase site_content (JSON) → 모든 방문자
이미지         → Supabase Storage (media 버킷)
```

문제가 있으면 Supabase **Logs** (API / Auth)와 브라우저 **F12 → Console** 오류 메시지를 확인하세요.
