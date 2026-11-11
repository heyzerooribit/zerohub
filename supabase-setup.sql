-- Run this once in Supabase: SQL Editor > New query > paste > Run

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;
create policy "users read their own admin row" on public.admins
  for select to authenticated using (user_id = auth.uid());

create table public.announcements (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);
alter table public.announcements enable row level security;

-- Anyone signed in (admin or guest) can read
create policy "signed-in users read announcements" on public.announcements
  for select to authenticated using (true);

-- Only admins can post or delete
create policy "admins post announcements" on public.announcements
  for insert to authenticated
  with check (exists (select 1 from public.admins where user_id = auth.uid()));
create policy "admins delete announcements" on public.announcements
  for delete to authenticated
  using (exists (select 1 from public.admins where user_id = auth.uid()));

-- AFTER you create your admin user (Authentication > Users > Add user),
-- run this with your admin email to make that account the admin:
-- insert into public.admins (user_id) select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
