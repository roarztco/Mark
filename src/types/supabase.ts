export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      areas: {
        Row: {
          color: string;
          created_at: string;
          icon: string | null;
          id: number;
          is_archived: boolean;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          color?: string;
          created_at?: string;
          icon?: string | null;
          id?: never;
          is_archived?: boolean;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          icon?: string | null;
          id?: never;
          is_archived?: boolean;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      attachments: {
        Row: {
          bucket_id: string;
          check_in_id: number | null;
          created_at: string;
          file_name: string;
          goal_id: number | null;
          id: number;
          mime_type: string | null;
          path: string;
          size_bytes: number | null;
          task_id: number | null;
          user_id: string;
        };
        Insert: {
          bucket_id: string;
          check_in_id?: number | null;
          created_at?: string;
          file_name: string;
          goal_id?: number | null;
          id?: never;
          mime_type?: string | null;
          path: string;
          size_bytes?: number | null;
          task_id?: number | null;
          user_id: string;
        };
        Update: {
          bucket_id?: string;
          check_in_id?: number | null;
          created_at?: string;
          file_name?: string;
          goal_id?: number | null;
          id?: never;
          mime_type?: string | null;
          path?: string;
          size_bytes?: number | null;
          task_id?: number | null;
          user_id?: string;
        };
        Relationships: Relationship[];
      };
      check_ins: {
        Row: {
          blockers: string | null;
          checked_in_at: string;
          created_at: string;
          energy: string | null;
          focus_minutes: number;
          goal_id: number | null;
          habit_id: number | null;
          id: number;
          mood: string | null;
          reflection: string | null;
          task_id: number | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          blockers?: string | null;
          checked_in_at?: string;
          created_at?: string;
          energy?: string | null;
          focus_minutes?: number;
          goal_id?: number | null;
          habit_id?: number | null;
          id?: never;
          mood?: string | null;
          reflection?: string | null;
          task_id?: number | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          blockers?: string | null;
          checked_in_at?: string;
          created_at?: string;
          energy?: string | null;
          focus_minutes?: number;
          goal_id?: number | null;
          habit_id?: number | null;
          id?: never;
          mood?: string | null;
          reflection?: string | null;
          task_id?: number | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: Relationship[];
      };
      focus_sessions: {
        Row: {
          created_at: string;
          duration_minutes: number | null;
          ended_at: string | null;
          goal_id: number | null;
          id: number;
          started_at: string;
          status: string;
          task_id: number | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          duration_minutes?: number | null;
          ended_at?: string | null;
          goal_id?: number | null;
          id?: never;
          started_at?: string;
          status?: string;
          task_id?: number | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          duration_minutes?: number | null;
          ended_at?: string | null;
          goal_id?: number | null;
          id?: never;
          started_at?: string;
          status?: string;
          task_id?: number | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: Relationship[];
      };
      goals: {
        Row: {
          area_id: number | null;
          color: string;
          completed_at: string | null;
          created_at: string;
          due_on: string | null;
          icon_key: string;
          id: number;
          next_action: string | null;
          progress: number;
          scope: string;
          starts_on: string | null;
          status: string;
          target_outcome: string | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          area_id?: number | null;
          color?: string;
          completed_at?: string | null;
          created_at?: string;
          due_on?: string | null;
          icon_key?: string;
          id?: never;
          next_action?: string | null;
          progress?: number;
          scope: string;
          starts_on?: string | null;
          status?: string;
          target_outcome?: string | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          area_id?: number | null;
          color?: string;
          completed_at?: string | null;
          created_at?: string;
          due_on?: string | null;
          icon_key?: string;
          id?: never;
          next_action?: string | null;
          progress?: number;
          scope?: string;
          starts_on?: string | null;
          status?: string;
          target_outcome?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: Relationship[];
      };
      habit_entries: {
        Row: {
          completed: boolean;
          created_at: string;
          entry_date: string;
          habit_id: number;
          id: number;
          note: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          created_at?: string;
          entry_date: string;
          habit_id: number;
          id?: never;
          note?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          created_at?: string;
          entry_date?: string;
          habit_id?: number;
          id?: never;
          note?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: Relationship[];
      };
      habits: {
        Row: {
          area_id: number | null;
          cadence: string;
          color: string;
          created_at: string;
          cue_time: string | null;
          goal_id: number | null;
          id: number;
          is_archived: boolean;
          name: string;
          streak: number;
          target_per_period: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          area_id?: number | null;
          cadence?: string;
          color?: string;
          created_at?: string;
          cue_time?: string | null;
          goal_id?: number | null;
          id?: never;
          is_archived?: boolean;
          name: string;
          streak?: number;
          target_per_period?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          area_id?: number | null;
          cadence?: string;
          color?: string;
          created_at?: string;
          cue_time?: string | null;
          goal_id?: number | null;
          id?: never;
          is_archived?: boolean;
          name?: string;
          streak?: number;
          target_per_period?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: Relationship[];
      };
      profiles: {
        Row: {
          avatar_path: string | null;
          created_at: string;
          display_name: string | null;
          onboarding_profile: string | null;
          theme: string;
          timezone: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_path?: string | null;
          created_at?: string;
          display_name?: string | null;
          onboarding_profile?: string | null;
          theme?: string;
          timezone?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_path?: string | null;
          created_at?: string;
          display_name?: string | null;
          onboarding_profile?: string | null;
          theme?: string;
          timezone?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          created_at: string;
          enabled: boolean;
          goal_id: number | null;
          habit_id: number | null;
          id: number;
          recurrence_rule: string | null;
          remind_at: string;
          task_id: number | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          enabled?: boolean;
          goal_id?: number | null;
          habit_id?: number | null;
          id?: never;
          recurrence_rule?: string | null;
          remind_at: string;
          task_id?: number | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          enabled?: boolean;
          goal_id?: number | null;
          habit_id?: number | null;
          id?: never;
          recurrence_rule?: string | null;
          remind_at?: string;
          task_id?: number | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: Relationship[];
      };
      tasks: {
        Row: {
          all_day: boolean;
          area_id: number | null;
          category: string | null;
          color: string;
          completed_at: string | null;
          created_at: string;
          end_time: string | null;
          goal_id: number | null;
          habit_id: number | null;
          id: number;
          notes: string | null;
          priority: string;
          reminder_at: string | null;
          reminder_enabled: boolean;
          scheduled_date: string | null;
          sort_order: number;
          start_time: string | null;
          status: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          all_day?: boolean;
          area_id?: number | null;
          category?: string | null;
          color?: string;
          completed_at?: string | null;
          created_at?: string;
          end_time?: string | null;
          goal_id?: number | null;
          habit_id?: number | null;
          id?: never;
          notes?: string | null;
          priority?: string;
          reminder_at?: string | null;
          reminder_enabled?: boolean;
          scheduled_date?: string | null;
          sort_order?: number;
          start_time?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          all_day?: boolean;
          area_id?: number | null;
          category?: string | null;
          color?: string;
          completed_at?: string | null;
          created_at?: string;
          end_time?: string | null;
          goal_id?: number | null;
          habit_id?: number | null;
          id?: never;
          notes?: string | null;
          priority?: string;
          reminder_at?: string | null;
          reminder_enabled?: boolean;
          scheduled_date?: string | null;
          sort_order?: number;
          start_time?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: Relationship[];
      };
    };
    Views: {
      analytics_daily_productivity: {
        Row: {
          activity_date: string;
          check_in_count: number;
          completed_task_minutes: number;
          focus_minutes: number;
          habit_checks_completed: number;
          scheduled_minutes: number;
          task_completion_rate: number;
          tasks_completed: number;
          tasks_total: number;
          user_id: string;
        };
        Relationships: [];
      };
      analytics_goal_progress: {
        Row: {
          checked_in_focus_minutes: number;
          completed_tasks: number;
          computed_progress: number;
          due_on: string | null;
          goal_id: number;
          linked_check_ins: number;
          linked_habits: number;
          linked_tasks: number;
          progress: number;
          scope: string;
          status: string;
          task_completion_rate: number;
          title: string;
          user_id: string;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals["public"];

export type Tables<T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])> =
  (DefaultSchema["Tables"] & DefaultSchema["Views"])[T] extends { Row: infer Row } ? Row : never;

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Insert: infer Insert } ? Insert : never;

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Update: infer Update } ? Update : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
