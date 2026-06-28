create or replace view public.analytics_goal_progress
with (security_invoker = true)
as
with task_rollup as (
  select
    user_id,
    goal_id,
    count(*)::integer as linked_tasks,
    count(*) filter (where status = 'completed')::integer as completed_tasks
  from public.tasks
  where goal_id is not null
  group by user_id, goal_id
),
habit_rollup as (
  select
    user_id,
    goal_id,
    count(*)::integer as linked_habits
  from public.habits
  where goal_id is not null
  group by user_id, goal_id
),
check_in_rollup as (
  select
    user_id,
    goal_id,
    count(*)::integer as linked_check_ins,
    coalesce(sum(focus_minutes), 0)::integer as checked_in_focus_minutes
  from public.check_ins
  where goal_id is not null
  group by user_id, goal_id
)
select
  goals.user_id,
  goals.id as goal_id,
  goals.title,
  goals.scope,
  goals.status,
  goals.progress,
  goals.due_on,
  coalesce(task_rollup.linked_tasks, 0) as linked_tasks,
  coalesce(task_rollup.completed_tasks, 0) as completed_tasks,
  coalesce(habit_rollup.linked_habits, 0) as linked_habits,
  coalesce(check_in_rollup.linked_check_ins, 0) as linked_check_ins,
  coalesce(check_in_rollup.checked_in_focus_minutes, 0) as checked_in_focus_minutes,
  case
    when coalesce(task_rollup.linked_tasks, 0) = 0 then goals.progress
    else round((task_rollup.completed_tasks::numeric / task_rollup.linked_tasks::numeric) * 100)::integer
  end as task_completion_rate,
  greatest(
    goals.progress,
    case
      when coalesce(task_rollup.linked_tasks, 0) = 0 then 0
      else round((task_rollup.completed_tasks::numeric / task_rollup.linked_tasks::numeric) * 100)::integer
    end
  ) as computed_progress
from public.goals
left join task_rollup
  on task_rollup.user_id = goals.user_id
  and task_rollup.goal_id = goals.id
left join habit_rollup
  on habit_rollup.user_id = goals.user_id
  and habit_rollup.goal_id = goals.id
left join check_in_rollup
  on check_in_rollup.user_id = goals.user_id
  and check_in_rollup.goal_id = goals.id;

grant select on public.analytics_goal_progress to authenticated;
