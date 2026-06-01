-- Supabase SQL Editor에서 실행하세요.

create table if not exists public.site_content (
  id text primary key default 'main',
  content jsonb not null,
  updated_at timestamptz default now()
);

alter table public.site_content enable row level security;

-- 누구나 사이트 콘텐츠 읽기
create policy "Public read site content"
  on public.site_content for select
  using (true);

-- 로그인한 관리자만 저장
create policy "Authenticated update site content"
  on public.site_content for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated upsert site content"
  on public.site_content for update
  using (auth.role() = 'authenticated');

-- 초기 행 (선택)
insert into public.site_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- Storage: Dashboard에서 bucket `media` 생성 (public)
