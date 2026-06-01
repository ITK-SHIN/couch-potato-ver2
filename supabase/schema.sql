-- ============================================================
-- 코치포테이토 CMS — Supabase SQL Editor에서 한 번 실행
-- ============================================================

-- 1) 사이트 콘텐츠 테이블
create table if not exists public.site_content (
  id text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.site_content enable row level security;

-- 기존 정책이 있으면 제거 후 재생성 (재실행 안전)
drop policy if exists "Public read site content" on public.site_content;
drop policy if exists "Authenticated insert site content" on public.site_content;
drop policy if exists "Authenticated update site content" on public.site_content;

-- 누구나 읽기 (공개 홈페이지)
create policy "Public read site content"
  on public.site_content for select
  using (true);

-- 로그인한 관리자만 쓰기
create policy "Authenticated insert site content"
  on public.site_content for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated update site content"
  on public.site_content for update
  using (auth.role() = 'authenticated');

insert into public.site_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- 2) 이미지 Storage 버킷 (public)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read media" on storage.objects;
drop policy if exists "Authenticated upload media" on storage.objects;
drop policy if exists "Authenticated update media" on storage.objects;

create policy "Public read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Authenticated upload media"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and auth.role() = 'authenticated'
  );

create policy "Authenticated update media"
  on storage.objects for update
  using (
    bucket_id = 'media'
    and auth.role() = 'authenticated'
  );
