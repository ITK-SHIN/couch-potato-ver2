# 사이트 관리자(CMS) 설정 가이드

운영자 1명이 **코딩 없이** 섹션 내용을 자주 수정할 수 있는 관리 화면입니다.

## 접속 주소

| 페이지 | URL |
|--------|-----|
| 공개 사이트 | `/` |
| 관리자 로그인 | `/admin/login` |
| 관리자 편집 | `/admin` |

## 1단계: 바로 써보기 (Supabase 없이)

1. `npm run dev` 실행
2. 브라우저에서 `http://localhost:5173/admin/login` 접속
3. 비밀번호: `.env`에 `VITE_ADMIN_PASSWORD`를 설정하지 않았다면 기본값 `couchpotato-admin`
4. 섹션 수정 후 **저장하기** 클릭 (오른쪽 **실시간 미리보기**에서 저장 전에도 확인 가능)

> 이 모드는 **같은 브라우저**에만 저장됩니다. PC/폰 여러 곳에서 수정하려면 2단계 Supabase 연결이 필요합니다.

## 2단계: Supabase 연결 (권장)

**상세 단계는 [SUPABASE_연결가이드.md](./SUPABASE_연결가이드.md) 를 따르세요.**

요약:

1. Supabase 프로젝트 생성 → **Settings → API**에서 URL, `anon` key 복사
2. `.env` 및 **Vercel Environment Variables**에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 설정
3. SQL Editor에서 `supabase/schema.sql` 실행 (DB + `media` 버킷 포함)
4. **Authentication → Users**에서 관리자 1명 생성
5. `/admin/login`에서 **이메일·비밀번호** 로그인 후 저장

> env 적용 후 `npm run dev` 재시작, Vercel은 **Redeploy** 필요.

## 관리 화면에서 수정 가능한 항목

- **히어로**: 문구, 배경 이미지, 버튼
- **하이라이트**: 카드 3개
- **소개**: 텍스트, 이미지, 강점·분야 목록
- **서비스**: 서비스 카드, CTA 문구
- **제작 과정**: 단계별 이미지·체크리스트
- **포트폴리오**: 작품 추가/삭제, 카테고리, 썸네일
- **문의·연락처**: 이메일, 전화, SNS, 폼 옵션
- **푸터**: 연락처, 저작권

## 보안 참고

- Supabase 연결 시: RLS로 **로그인한 사용자만** 저장 가능
- 비밀번호만 쓰는 로컬 모드: 반드시 `VITE_ADMIN_PASSWORD`를 강한 값으로 변경
- 관리자 URL(`/admin`)은 검색엔진에 노출되지 않도록 robots 설정 유지

## 문제 해결

| 증상 | 해결 |
|------|------|
| 저장해도 다른 PC에 안 보임 | Supabase `.env` 설정 후 재시작 |
| 이미지 업로드 실패 | Storage bucket `media` public 생성 확인 |
| 로그인 안 됨 | Supabase 사용자 생성 또는 `VITE_ADMIN_PASSWORD` 확인 |
