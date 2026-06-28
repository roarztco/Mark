do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'areas_user_id_id_key'
      and conrelid = 'public.areas'::regclass
  ) then
    alter table public.areas
      add constraint areas_user_id_id_key unique (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'goals_user_id_id_key'
      and conrelid = 'public.goals'::regclass
  ) then
    alter table public.goals
      add constraint goals_user_id_id_key unique (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'habits_user_id_id_key'
      and conrelid = 'public.habits'::regclass
  ) then
    alter table public.habits
      add constraint habits_user_id_id_key unique (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tasks_user_id_id_key'
      and conrelid = 'public.tasks'::regclass
  ) then
    alter table public.tasks
      add constraint tasks_user_id_id_key unique (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'check_ins_user_id_id_key'
      and conrelid = 'public.check_ins'::regclass
  ) then
    alter table public.check_ins
      add constraint check_ins_user_id_id_key unique (user_id, id);
  end if;
end $$;

create index if not exists goals_user_id_area_id_idx on public.goals (user_id, area_id);
create index if not exists habits_user_id_goal_id_idx on public.habits (user_id, goal_id);
create index if not exists habits_user_id_area_id_idx on public.habits (user_id, area_id);
create index if not exists habit_entries_user_id_habit_id_idx on public.habit_entries (user_id, habit_id);
create index if not exists tasks_user_id_area_id_idx on public.tasks (user_id, area_id);
create index if not exists tasks_user_id_goal_id_idx on public.tasks (user_id, goal_id);
create index if not exists tasks_user_id_habit_id_idx on public.tasks (user_id, habit_id);
create index if not exists reminders_user_id_task_id_idx on public.reminders (user_id, task_id);
create index if not exists reminders_user_id_goal_id_idx on public.reminders (user_id, goal_id);
create index if not exists reminders_user_id_habit_id_idx on public.reminders (user_id, habit_id);
create index if not exists check_ins_user_id_task_id_idx on public.check_ins (user_id, task_id);
create index if not exists check_ins_user_id_goal_id_idx on public.check_ins (user_id, goal_id);
create index if not exists check_ins_user_id_habit_id_idx on public.check_ins (user_id, habit_id);
create index if not exists focus_sessions_user_id_task_id_idx on public.focus_sessions (user_id, task_id);
create index if not exists focus_sessions_user_id_goal_id_idx on public.focus_sessions (user_id, goal_id);
create index if not exists attachments_user_id_task_id_idx on public.attachments (user_id, task_id);
create index if not exists attachments_user_id_goal_id_idx on public.attachments (user_id, goal_id);
create index if not exists attachments_user_id_check_in_id_idx on public.attachments (user_id, check_in_id);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'goals_user_area_id_fkey'
      and conrelid = 'public.goals'::regclass
  ) then
    alter table public.goals
      add constraint goals_user_area_id_fkey
      foreign key (user_id, area_id) references public.areas (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'habits_user_goal_id_fkey'
      and conrelid = 'public.habits'::regclass
  ) then
    alter table public.habits
      add constraint habits_user_goal_id_fkey
      foreign key (user_id, goal_id) references public.goals (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'habits_user_area_id_fkey'
      and conrelid = 'public.habits'::regclass
  ) then
    alter table public.habits
      add constraint habits_user_area_id_fkey
      foreign key (user_id, area_id) references public.areas (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'habit_entries_user_habit_id_fkey'
      and conrelid = 'public.habit_entries'::regclass
  ) then
    alter table public.habit_entries
      add constraint habit_entries_user_habit_id_fkey
      foreign key (user_id, habit_id) references public.habits (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tasks_user_area_id_fkey'
      and conrelid = 'public.tasks'::regclass
  ) then
    alter table public.tasks
      add constraint tasks_user_area_id_fkey
      foreign key (user_id, area_id) references public.areas (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tasks_user_goal_id_fkey'
      and conrelid = 'public.tasks'::regclass
  ) then
    alter table public.tasks
      add constraint tasks_user_goal_id_fkey
      foreign key (user_id, goal_id) references public.goals (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tasks_user_habit_id_fkey'
      and conrelid = 'public.tasks'::regclass
  ) then
    alter table public.tasks
      add constraint tasks_user_habit_id_fkey
      foreign key (user_id, habit_id) references public.habits (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'reminders_user_task_id_fkey'
      and conrelid = 'public.reminders'::regclass
  ) then
    alter table public.reminders
      add constraint reminders_user_task_id_fkey
      foreign key (user_id, task_id) references public.tasks (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'reminders_user_goal_id_fkey'
      and conrelid = 'public.reminders'::regclass
  ) then
    alter table public.reminders
      add constraint reminders_user_goal_id_fkey
      foreign key (user_id, goal_id) references public.goals (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'reminders_user_habit_id_fkey'
      and conrelid = 'public.reminders'::regclass
  ) then
    alter table public.reminders
      add constraint reminders_user_habit_id_fkey
      foreign key (user_id, habit_id) references public.habits (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'check_ins_user_task_id_fkey'
      and conrelid = 'public.check_ins'::regclass
  ) then
    alter table public.check_ins
      add constraint check_ins_user_task_id_fkey
      foreign key (user_id, task_id) references public.tasks (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'check_ins_user_goal_id_fkey'
      and conrelid = 'public.check_ins'::regclass
  ) then
    alter table public.check_ins
      add constraint check_ins_user_goal_id_fkey
      foreign key (user_id, goal_id) references public.goals (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'check_ins_user_habit_id_fkey'
      and conrelid = 'public.check_ins'::regclass
  ) then
    alter table public.check_ins
      add constraint check_ins_user_habit_id_fkey
      foreign key (user_id, habit_id) references public.habits (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'focus_sessions_user_task_id_fkey'
      and conrelid = 'public.focus_sessions'::regclass
  ) then
    alter table public.focus_sessions
      add constraint focus_sessions_user_task_id_fkey
      foreign key (user_id, task_id) references public.tasks (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'focus_sessions_user_goal_id_fkey'
      and conrelid = 'public.focus_sessions'::regclass
  ) then
    alter table public.focus_sessions
      add constraint focus_sessions_user_goal_id_fkey
      foreign key (user_id, goal_id) references public.goals (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'attachments_user_task_id_fkey'
      and conrelid = 'public.attachments'::regclass
  ) then
    alter table public.attachments
      add constraint attachments_user_task_id_fkey
      foreign key (user_id, task_id) references public.tasks (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'attachments_user_goal_id_fkey'
      and conrelid = 'public.attachments'::regclass
  ) then
    alter table public.attachments
      add constraint attachments_user_goal_id_fkey
      foreign key (user_id, goal_id) references public.goals (user_id, id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'attachments_user_check_in_id_fkey'
      and conrelid = 'public.attachments'::regclass
  ) then
    alter table public.attachments
      add constraint attachments_user_check_in_id_fkey
      foreign key (user_id, check_in_id) references public.check_ins (user_id, id);
  end if;
end $$;

create or replace view public.analytics_daily_productivity
with (security_invoker = true)
as
with task_daily as (
  select
    user_id,
    scheduled_date as activity_date,
    count(*)::integer as tasks_total,
    count(*) filter (where status = 'completed')::integer as tasks_completed,
    coalesce(
      sum(
        case
          when start_time is not null and end_time is not null
          then extract(epoch from (end_time - start_time)) / 60
          else 0
        end
      ),
      0
    )::integer as scheduled_minutes,
    coalesce(
      sum(
        case
          when status = 'completed' and start_time is not null and end_time is not null
          then extract(epoch from (end_time - start_time)) / 60
          else 0
        end
      ),
      0
    )::integer as completed_task_minutes
  from public.tasks
  where scheduled_date is not null
  group by user_id, scheduled_date
),
habit_daily as (
  select
    user_id,
    entry_date as activity_date,
    count(*) filter (where completed)::integer as habit_checks_completed
  from public.habit_entries
  group by user_id, entry_date
),
check_in_daily as (
  select
    user_id,
    checked_in_at::date as activity_date,
    count(*)::integer as check_in_count,
    coalesce(sum(focus_minutes), 0)::integer as check_in_focus_minutes
  from public.check_ins
  group by user_id, checked_in_at::date
),
focus_daily as (
  select
    user_id,
    started_at::date as activity_date,
    coalesce(
      sum(
        coalesce(
          duration_minutes,
          case
            when ended_at is not null
            then extract(epoch from (ended_at - started_at)) / 60
            else 0
          end
        )
      ),
      0
    )::integer as focus_session_minutes
  from public.focus_sessions
  group by user_id, started_at::date
),
activity_days as (
  select user_id, activity_date from task_daily
  union
  select user_id, activity_date from habit_daily
  union
  select user_id, activity_date from check_in_daily
  union
  select user_id, activity_date from focus_daily
)
select
  activity_days.user_id,
  activity_days.activity_date,
  coalesce(task_daily.tasks_total, 0) as tasks_total,
  coalesce(task_daily.tasks_completed, 0) as tasks_completed,
  coalesce(task_daily.scheduled_minutes, 0) as scheduled_minutes,
  coalesce(task_daily.completed_task_minutes, 0) as completed_task_minutes,
  coalesce(check_in_daily.check_in_focus_minutes, 0) + coalesce(focus_daily.focus_session_minutes, 0) as focus_minutes,
  coalesce(check_in_daily.check_in_count, 0) as check_in_count,
  coalesce(habit_daily.habit_checks_completed, 0) as habit_checks_completed,
  case
    when coalesce(task_daily.tasks_total, 0) = 0 then 0
    else round((coalesce(task_daily.tasks_completed, 0)::numeric / task_daily.tasks_total::numeric) * 100)::integer
  end as task_completion_rate
from activity_days
left join task_daily using (user_id, activity_date)
left join habit_daily using (user_id, activity_date)
left join check_in_daily using (user_id, activity_date)
left join focus_daily using (user_id, activity_date);

create or replace view public.analytics_goal_progress
with (security_invoker = true)
as
select
  goals.user_id,
  goals.id as goal_id,
  goals.title,
  goals.scope,
  goals.status,
  goals.progress,
  goals.due_on,
  count(distinct tasks.id)::integer as linked_tasks,
  count(distinct tasks.id) filter (where tasks.status = 'completed')::integer as completed_tasks,
  count(distinct habits.id)::integer as linked_habits,
  count(distinct check_ins.id)::integer as linked_check_ins,
  coalesce(sum(distinct check_ins.focus_minutes), 0)::integer as checked_in_focus_minutes,
  case
    when count(distinct tasks.id) = 0 then goals.progress
    else round((count(distinct tasks.id) filter (where tasks.status = 'completed')::numeric / count(distinct tasks.id)::numeric) * 100)::integer
  end as task_completion_rate,
  greatest(
    goals.progress,
    case
      when count(distinct tasks.id) = 0 then 0
      else round((count(distinct tasks.id) filter (where tasks.status = 'completed')::numeric / count(distinct tasks.id)::numeric) * 100)::integer
    end
  ) as computed_progress
from public.goals
left join public.tasks
  on tasks.user_id = goals.user_id
  and tasks.goal_id = goals.id
left join public.habits
  on habits.user_id = goals.user_id
  and habits.goal_id = goals.id
left join public.check_ins
  on check_ins.user_id = goals.user_id
  and check_ins.goal_id = goals.id
group by
  goals.user_id,
  goals.id,
  goals.title,
  goals.scope,
  goals.status,
  goals.progress,
  goals.due_on;

grant select on public.analytics_daily_productivity to authenticated;
grant select on public.analytics_goal_progress to authenticated;
