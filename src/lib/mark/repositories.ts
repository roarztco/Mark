import { supabase } from "../supabase/client";
import type { Database, Tables, TablesInsert, TablesUpdate } from "../../types/supabase";

type TableName = keyof Database["public"]["Tables"];

type UserOwnedTable = Extract<
  TableName,
  "profiles" | "areas" | "goals" | "habits" | "habit_entries" | "tasks" | "reminders" | "check_ins" | "focus_sessions" | "attachments"
>;

function fromUserTable(table: UserOwnedTable) {
  return supabase.from(table) as any;
}

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("You must be signed in to use Mark.");

  return user.id;
}

export async function listRows<TTable extends UserOwnedTable>(table: TTable) {
  const userId = await getCurrentUserId();
  return fromUserTable(table).select("*").eq("user_id", userId);
}

export async function createUserRow<TTable extends UserOwnedTable>(table: TTable, payload: Omit<TablesInsert<TTable>, "user_id">) {
  const userId = await getCurrentUserId();
  return fromUserTable(table).insert({ ...payload, user_id: userId }).select().single();
}

export async function updateUserRow<TTable extends UserOwnedTable>(table: TTable, id: number | string, payload: TablesUpdate<TTable>) {
  const userId = await getCurrentUserId();
  return fromUserTable(table).update(payload).eq("id", id).eq("user_id", userId).select().single();
}

export async function deleteUserRow<TTable extends UserOwnedTable>(table: TTable, id: number | string) {
  const userId = await getCurrentUserId();
  return fromUserTable(table).delete().eq("id", id).eq("user_id", userId);
}

export async function getWorkspaceSnapshot() {
  const userId = await getCurrentUserId();

  const [profile, areas, goals, habits, habitEntries, tasks, reminders, checkIns, focusSessions, attachments] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("areas").select("*").eq("user_id", userId).order("created_at"),
    supabase.from("goals").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("habits").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("habit_entries").select("*").eq("user_id", userId).order("entry_date", { ascending: false }),
    supabase.from("tasks").select("*").eq("user_id", userId).order("scheduled_date").order("start_time"),
    supabase.from("reminders").select("*").eq("user_id", userId).order("remind_at"),
    supabase.from("check_ins").select("*").eq("user_id", userId).order("checked_in_at", { ascending: false }),
    supabase.from("focus_sessions").select("*").eq("user_id", userId).order("started_at", { ascending: false }),
    supabase.from("attachments").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);

  return {
    profile,
    areas,
    goals,
    habits,
    habitEntries,
    tasks,
    reminders,
    checkIns,
    focusSessions,
    attachments,
  };
}

export async function getDailyProductivityAnalytics() {
  const userId = await getCurrentUserId();
  return supabase
    .from("analytics_daily_productivity")
    .select("*")
    .eq("user_id", userId)
    .order("activity_date", { ascending: false });
}

export async function getGoalProgressAnalytics() {
  const userId = await getCurrentUserId();
  return supabase
    .from("analytics_goal_progress")
    .select("*")
    .eq("user_id", userId)
    .order("due_on", { ascending: true, nullsFirst: false });
}

export type MarkProfile = Tables<"profiles">;
export type MarkTask = Tables<"tasks">;
export type MarkGoal = Tables<"goals">;
export type MarkHabit = Tables<"habits">;
export type MarkCheckIn = Tables<"check_ins">;
export type MarkDailyProductivity = Tables<"analytics_daily_productivity">;
export type MarkGoalProgressAnalytics = Tables<"analytics_goal_progress">;
