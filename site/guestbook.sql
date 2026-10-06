-- Run once in Supabase (SQL Editor > New query > paste > Run) to create the guestbook table.
create table public.guestbook (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null default 'anonymous' check (char_length(name) between 1 and 40),
  message text not null default '' check (char_length(message) <= 160),
  doodle jsonb not null default '[]' check (jsonb_typeof(doodle) = 'array' and pg_column_size(doodle) < 40000),
  paper text not null default 'butter' check (paper in ('butter', 'pink', 'mint', 'sky', 'white')),
  -- tick this in the Table Editor to take a note down (or just delete the row)
  hidden boolean not null default false
);

alter table public.guestbook enable row level security;
grant select, insert on public.guestbook to anon;

-- visitors see every note that isn't hidden
create policy "read pinned notes" on public.guestbook for select to anon using (not hidden);
-- visitors can add notes, but never edit or delete them
create policy "leave a note" on public.guestbook for insert to anon with check (message <> '' or doodle <> '[]');

-- Want to approve notes before they show up? Run this, then untick `hidden` on the ones you like:
-- alter table public.guestbook alter column hidden set default true;
