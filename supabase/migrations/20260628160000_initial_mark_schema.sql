create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_path text,
  onboarding_profile text,
  timezone text not null default 'UTC',
  theme text not null default 'light' check (theme in ('light', 'dark')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.areas (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default 'blue',
  icon text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.goals (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  area_id bigint references public.areas(id) on delete set null,
  title text not null,
  scope text not null check (scope in ('day', 'week', 'month', 'quarter', 'year')),
  target_outcome text,
  next_action text,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  starts_on date,
  due_on date,
  color text not null default 'blue',
  icon_key text not null default 'target',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.habits (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id bigint references public.goals(id) on delete set null,
  area_id bigint references public.areas(id) on delete set null,
  name text not null,
  cue_time time,
  cadence text not null default 'daily',
  target_per_period integer not null default 1 check (target_per_period > 0),
  streak integer not null default 0 check (streak >= 0),
  color text not null default 'blue',
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habit_entries (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id bigint not null references public.habits(id) on delete cascade,
  entry_date date not null,
  completed boolean not null default true,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (habit_id, entry_date)
);

create table if not exists public.tasks (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  area_id bigint references public.areas(id) on delete set null,
  goal_id bigint references public.goals(id) on delete set null,
  habit_id bigint references public.habits(id) on delete set null,
  title text not null,
  notes text,
  scheduled_date date,
  start_time time,
  end_time time,
  all_day boolean not null default false,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  category text,
  color text not null default 'blue',
  status text not null default 'scheduled' check (status in ('inbox', 'scheduled', 'in_progress', 'completed', 'archived')),
  reminder_enabled boolean not null default false,
  reminder_at timestamptz,
  sort_order integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time is null or start_time is null or end_time > start_time)
);

create table if not exists public.reminders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id bigint references public.tasks(id) on delete cascade,
  goal_id bigint references public.goals(id) on delete cascade,
  habit_id bigint references public.habits(id) on delete cascade,
  title text not null,
  remind_at timestamptz not null,
  recurrence_rule text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.check_ins (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id bigint references public.tasks(id) on delete set null,
  goal_id bigint references public.goals(id) on delete set null,
  habit_id bigint references public.habits(id) on delete set null,
  focus_minutes integer not null default 0 check (focus_minutes >= 0),
  energy text check (energy in ('low', 'steady', 'high')),
  mood text,
  reflection text,
  blockers text,
  checked_in_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.focus_sessions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id bigint references public.tasks(id) on delete set null,
  goal_id bigint references public.goals(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  status text not null default 'running' check (status in ('running', 'completed', 'canceled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attachments (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket_id text not null,
  path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  task_id bigint references public.tasks(id) on delete cascade,
  goal_id bigint references public.goals(id) on delete cascade,
  check_in_id bigint references public.check_ins(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (bucket_id, path)
);

create index if not exists areas_user_id_idx on public.areas(user_id);
create index if not exists goals_user_id_status_idx on public.goals(user_id, status);
create index if not exists goals_area_id_idx on public.goals(area_id);
create index if not exists habits_user_id_archived_idx on public.habits(user_id, is_archived);
create index if not exists habits_goal_id_idx on public.habits(goal_id);
create index if not exists habits_area_id_idx on public.habits(area_id);
create index if not exists habit_entries_user_id_date_idx on public.habit_entries(user_id, entry_date);
create index if not exists habit_entries_habit_id_idx on public.habit_entries(habit_id);
create index if not exists tasks_user_id_scheduled_date_idx on public.tasks(user_id, scheduled_date);
create index if not exists tasks_user_id_status_idx on public.tasks(user_id, status);
create index if not exists tasks_area_id_idx on public.tasks(area_id);
create index if not exists tasks_goal_id_idx on public.tasks(goal_id);
create index if not exists tasks_habit_id_idx on public.tasks(habit_id);
create index if not exists reminders_user_id_remind_at_idx on public.reminders(user_id, remind_at);
create index if not exists reminders_task_id_idx on public.reminders(task_id);
create index if not exists reminders_goal_id_idx on public.reminders(goal_id);
create index if not exists reminders_habit_id_idx on public.reminders(habit_id);
create index if not exists check_ins_user_id_checked_in_at_idx on public.check_ins(user_id, checked_in_at desc);
create index if not exists check_ins_task_id_idx on public.check_ins(task_id);
create index if not exists check_ins_goal_id_idx on public.check_ins(goal_id);
create index if not exists check_ins_habit_id_idx on public.check_ins(habit_id);
create index if not exists focus_sessions_user_id_started_at_idx on public.focus_sessions(user_id, started_at desc);
create index if not exists focus_sessions_task_id_idx on public.focus_sessions(task_id);
create index if not exists focus_sessions_goal_id_idx on public.focus_sessions(goal_id);
create index if not exists attachments_user_id_idx on public.attachments(user_id);
create index if not exists attachments_task_id_idx on public.attachments(task_id);
create index if not exists attachments_goal_id_idx on public.attachments(goal_id);
create index if not exists attachments_check_in_id_idx on public.attachments(check_in_id);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'areas',
    'goals',
    'habits',
    'habit_entries',
    'tasks',
    'reminders',
    'check_ins',
    'focus_sessions'
  ] loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.areas enable row level security;
alter table public.goals enable row level security;
alter table public.habits enable row level security;
alter table public.habit_entries enable row level security;
alter table public.tasks enable row level security;
alter table public.reminders enable row level security;
alter table public.check_ins enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.attachments enable row level security;

alter table public.profiles force row level security;
alter table public.areas force row level security;
alter table public.goals force row level security;
alter table public.habits force row level security;
alter table public.habit_entries force row level security;
alter table public.tasks force row level security;
alter table public.reminders force row level security;
alter table public.check_ins force row level security;
alter table public.focus_sessions force row level security;
alter table public.attachments force row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (user_id = (select auth.uid()));
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (user_id = (select auth.uid()));
create policy "profiles_update_own" on public.profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "profiles_delete_own" on public.profiles for delete to authenticated using (user_id = (select auth.uid()));

create policy "areas_select_own" on public.areas for select to authenticated using (user_id = (select auth.uid()));
create policy "areas_insert_own" on public.areas for insert to authenticated with check (user_id = (select auth.uid()));
create policy "areas_update_own" on public.areas for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "areas_delete_own" on public.areas for delete to authenticated using (user_id = (select auth.uid()));

create policy "goals_select_own" on public.goals for select to authenticated using (user_id = (select auth.uid()));
create policy "goals_insert_own" on public.goals for insert to authenticated with check (user_id = (select auth.uid()));
create policy "goals_update_own" on public.goals for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "goals_delete_own" on public.goals for delete to authenticated using (user_id = (select auth.uid()));

create policy "habits_select_own" on public.habits for select to authenticated using (user_id = (select auth.uid()));
create policy "habits_insert_own" on public.habits for insert to authenticated with check (user_id = (select auth.uid()));
create policy "habits_update_own" on public.habits for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "habits_delete_own" on public.habits for delete to authenticated using (user_id = (select auth.uid()));

create policy "habit_entries_select_own" on public.habit_entries for select to authenticated using (user_id = (select auth.uid()));
create policy "habit_entries_insert_own" on public.habit_entries for insert to authenticated with check (user_id = (select auth.uid()));
create policy "habit_entries_update_own" on public.habit_entries for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "habit_entries_delete_own" on public.habit_entries for delete to authenticated using (user_id = (select auth.uid()));

create policy "tasks_select_own" on public.tasks for select to authenticated using (user_id = (select auth.uid()));
create policy "tasks_insert_own" on public.tasks for insert to authenticated with check (user_id = (select auth.uid()));
create policy "tasks_update_own" on public.tasks for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "tasks_delete_own" on public.tasks for delete to authenticated using (user_id = (select auth.uid()));

create policy "reminders_select_own" on public.reminders for select to authenticated using (user_id = (select auth.uid()));
create policy "reminders_insert_own" on public.reminders for insert to authenticated with check (user_id = (select auth.uid()));
create policy "reminders_update_own" on public.reminders for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "reminders_delete_own" on public.reminders for delete to authenticated using (user_id = (select auth.uid()));

create policy "check_ins_select_own" on public.check_ins for select to authenticated using (user_id = (select auth.uid()));
create policy "check_ins_insert_own" on public.check_ins for insert to authenticated with check (user_id = (select auth.uid()));
create policy "check_ins_update_own" on public.check_ins for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "check_ins_delete_own" on public.check_ins for delete to authenticated using (user_id = (select auth.uid()));

create policy "focus_sessions_select_own" on public.focus_sessions for select to authenticated using (user_id = (select auth.uid()));
create policy "focus_sessions_insert_own" on public.focus_sessions for insert to authenticated with check (user_id = (select auth.uid()));
create policy "focus_sessions_update_own" on public.focus_sessions for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "focus_sessions_delete_own" on public.focus_sessions for delete to authenticated using (user_id = (select auth.uid()));

create policy "attachments_select_own" on public.attachments for select to authenticated using (user_id = (select auth.uid()));
create policy "attachments_insert_own" on public.attachments for insert to authenticated with check (user_id = (select auth.uid()));
create policy "attachments_update_own" on public.attachments for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "attachments_delete_own" on public.attachments for delete to authenticated using (user_id = (select auth.uid()));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (user_id) do nothing;

  insert into public.areas (user_id, name, color, icon)
  values
    (new.id, 'Personal', 'blue', 'user'),
    (new.id, 'Work', 'green', 'briefcase'),
    (new.id, 'Health', 'emerald', 'activity'),
    (new.id, 'Learning', 'violet', 'book-open')
  on conflict (user_id, name) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('mark-avatars', 'mark-avatars', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('mark-attachments', 'mark-attachments', false, 52428800, null)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "avatars_public_read" on storage.objects
  for select to public
  using (bucket_id = 'mark-avatars');

create policy "users_insert_own_avatars" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'mark-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users_update_own_avatars" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'mark-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'mark-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users_delete_own_avatars" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'mark-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users_read_own_attachments" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'mark-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users_insert_own_attachments" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'mark-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users_update_own_attachments" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'mark-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'mark-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users_delete_own_attachments" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'mark-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
