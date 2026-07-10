import {
  AlarmClock,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  CreditCard,
  Flame,
  Focus,
  Gauge,
  Goal,
  Grid2X2,
  Keyboard,
  LayoutList,
  ListChecks,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  MoreHorizontal,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  Play,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Sun,
  Target,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSession, signInWithEmail, signInWithGoogle, signOut, signUpWithEmail } from "./lib/supabase/auth";
import { createUserRow, deleteUserRow, getWorkspaceSnapshot, updateUserRow } from "./lib/mark/repositories";
import { supabase } from "./lib/supabase/client";
import { getAvatarPublicUrl, uploadAvatar } from "./lib/supabase/storage";

const navItems = [
  { label: "Overview", icon: Grid2X2 },
  { label: "Calendar", icon: CalendarDays },
  { label: "Tasks", icon: ListChecks },
  { label: "Goals", icon: Target },
  { label: "Focus", icon: Focus },
  { label: "Habits", icon: LayoutList },
  { label: "Analytics", icon: BarChart3 },
  { label: "Check-ins", icon: CheckCircle2 },
];

const routeMap = {
  landing: "#/",
  login: "#/login",
  signup: "#/signup",
  onboarding: "#/onboarding",
  app: "#/app",
};

const markLogoSrc = "/brand/mark-logo.png";
const markLogoIconSrc = "/brand/mark-logo-icon.png";

const onboardingOptions = [
  {
    id: "startup",
    label: "Startup",
    title: "Build and launch faster",
    detail: "Calendar blocks, launch goals, customer follow-ups, and founder check-ins.",
    icon: Target,
    accent: "blue",
    tasks: [
      ["Define launch milestone", "Product Development", "08:30", "10:00", "Planning", "blue", "High"],
      ["Customer discovery calls", "Growth", "10:30", "11:30", "Meeting", "amber", "High"],
      ["Ship product sprint task", "Product Development", "13:00", "15:00", "Focus", "blue", "High"],
      ["Review metrics and blockers", "Operations", "16:30", "17:00", "Review", "violet", "Medium"],
    ],
    inbox: ["Write investor update", "Prioritize activation issue", "Prepare launch checklist", "Review pricing page copy"],
    goals: [
      ["Ship public beta", 28, "blue", "goal", "Month", "Launch a usable beta by month end", "Choose the next launch milestone", "Product Development"],
      ["Reach 20 customer conversations", 15, "green", "target", "Month", "Complete 20 discovery calls", "Book three calls this week", "Growth"],
    ],
    habits: [
      ["Morning founder review", "8:00 AM", "Ship public beta", 4, "blue"],
      ["Customer learning note", "4:30 PM", "Reach 20 customer conversations", 3, "green"],
      ["Shutdown plan", "6:00 PM", "Ship public beta", 5, "violet"],
    ],
  },
  {
    id: "school",
    label: "School",
    title: "Stay ahead of classes",
    detail: "Study sessions, assignment deadlines, reading habits, and weekly reviews.",
    icon: BookOpen,
    accent: "violet",
    tasks: [
      ["Review lecture notes", "Learning", "08:00", "09:00", "Study", "violet", "High"],
      ["Problem set block", "Learning", "10:00", "11:30", "Focus", "blue", "High"],
      ["Reading session", "Learning", "14:00", "15:00", "Study", "green", "Medium"],
      ["Plan tomorrow's classes", "Personal", "17:00", "17:30", "Planning", "slate", "Low"],
    ],
    inbox: ["Upload assignment draft", "Make exam study guide", "Email project partner", "Summarize chapter notes"],
    goals: [
      ["Finish semester strong", 42, "violet", "book", "Month", "Keep every course above target grade", "Finish this week's assignments", "Learning"],
      ["Study 12 focused hours weekly", 35, "blue", "gauge", "Week", "Protect 12 hours of deep study", "Schedule next study block", "Learning"],
    ],
    habits: [
      ["Daily note review", "7:30 PM", "Finish semester strong", 6, "violet"],
      ["Distraction-free study", "10:00 AM", "Study 12 focused hours weekly", 5, "blue"],
      ["Evening assignment scan", "8:30 PM", "Finish semester strong", 4, "green"],
    ],
  },
  {
    id: "discipline",
    label: "Discipline",
    title: "Build personal consistency",
    detail: "Daily planning, deep work, habit streaks, and reflection loops.",
    icon: Flame,
    accent: "orange",
    tasks: [
      ["Plan the day", "Personal", "07:30", "08:00", "Planning", "blue", "High"],
      ["Deep work block", "Personal", "09:00", "11:00", "Focus", "blue", "High"],
      ["Admin cleanup", "Personal", "13:30", "14:15", "Operations", "slate", "Medium"],
      ["Daily reflection", "Personal", "18:00", "18:20", "Review", "orange", "Medium"],
    ],
    inbox: ["Define top three priorities", "Clean task inbox", "Choose tomorrow's focus block", "Review habit streak"],
    goals: [
      ["Complete 30 disciplined days", 18, "orange", "sparkles", "Month", "Hit the daily planning and reflection loop", "Protect tomorrow morning's plan", "Personal"],
      ["Finish 20 deep work blocks", 25, "blue", "gauge", "Month", "Complete 20 focused sessions", "Schedule the next focus block", "Personal"],
    ],
    habits: [
      ["Morning planning", "7:30 AM", "Complete 30 disciplined days", 8, "blue"],
      ["Deep work start", "9:00 AM", "Finish 20 deep work blocks", 6, "orange"],
      ["Evening reset", "6:00 PM", "Complete 30 disciplined days", 7, "violet"],
    ],
  },
  {
    id: "health",
    label: "Health",
    title: "Protect energy and recovery",
    detail: "Training blocks, sleep routines, nutrition habits, and progress reviews.",
    icon: Gauge,
    accent: "green",
    tasks: [
      ["Morning movement", "Health", "07:00", "07:45", "Health", "green", "High"],
      ["Meal prep planning", "Health", "12:30", "13:00", "Planning", "amber", "Medium"],
      ["Recovery walk", "Health", "16:30", "17:00", "Health", "green", "Medium"],
      ["Sleep shutdown routine", "Personal", "21:30", "22:00", "Routine", "violet", "High"],
    ],
    inbox: ["Log workout notes", "Plan weekly meals", "Book recovery day", "Update sleep target"],
    goals: [
      ["Train 16 times this month", 31, "green", "gauge", "Month", "Complete 16 planned workouts", "Schedule the next two sessions", "Health"],
      ["Average 7h 30m sleep", 44, "violet", "sparkles", "Month", "Keep a steady sleep window", "Start shutdown routine tonight", "Health"],
    ],
    habits: [
      ["Hydration check", "10:00 AM", "Train 16 times this month", 9, "green"],
      ["Workout log", "6:00 PM", "Train 16 times this month", 5, "blue"],
      ["Sleep shutdown", "9:30 PM", "Average 7h 30m sleep", 6, "violet"],
    ],
  },
  {
    id: "creator",
    label: "Creator",
    title: "Ship creative work weekly",
    detail: "Production blocks, publishing deadlines, audience tasks, and review rituals.",
    icon: Sparkles,
    accent: "violet",
    tasks: [
      ["Outline new piece", "Creation", "08:30", "09:30", "Planning", "violet", "High"],
      ["Production block", "Creation", "10:00", "12:00", "Focus", "blue", "High"],
      ["Edit and package", "Creation", "14:00", "15:30", "Creation", "green", "Medium"],
      ["Audience replies", "Growth", "16:30", "17:00", "Communication", "amber", "Medium"],
    ],
    inbox: ["Draft next content idea", "Review publishing calendar", "Collect audience questions", "Update creative swipe file"],
    goals: [
      ["Publish 8 pieces this month", 22, "violet", "sparkles", "Month", "Publish consistently without rushing", "Pick this week's publish slot", "Creation"],
      ["Build a 30 idea backlog", 40, "blue", "book", "Month", "Capture 30 strong ideas", "Add five ideas today", "Creation"],
    ],
    habits: [
      ["Daily idea capture", "8:00 AM", "Build a 30 idea backlog", 10, "violet"],
      ["Production start", "10:00 AM", "Publish 8 pieces this month", 4, "blue"],
      ["Audience note", "5:00 PM", "Publish 8 pieces this month", 5, "amber"],
    ],
  },
  {
    id: "team",
    label: "Team ops",
    title: "Keep work moving clearly",
    detail: "Meetings, follow-ups, project goals, and operating rhythm in one place.",
    icon: LayoutList,
    accent: "blue",
    tasks: [
      ["Team priorities review", "Operations", "08:30", "09:00", "Planning", "blue", "High"],
      ["Stand-up and blockers", "Operations", "09:30", "10:00", "Meeting", "green", "High"],
      ["Process improvement block", "Operations", "13:00", "14:30", "Focus", "violet", "Medium"],
      ["Send status update", "Operations", "16:00", "16:30", "Communication", "amber", "Medium"],
    ],
    inbox: ["Collect blockers", "Update weekly scorecard", "Document handoff process", "Review overdue tasks"],
    goals: [
      ["Reduce weekly blockers", 36, "blue", "target", "Month", "Remove recurring blockers from team flow", "Pick one process fix", "Operations"],
      ["Ship weekly status rhythm", 55, "green", "check", "Month", "Send clear weekly updates", "Draft Friday update", "Operations"],
    ],
    habits: [
      ["Morning blocker scan", "8:30 AM", "Reduce weekly blockers", 7, "blue"],
      ["Async update", "4:00 PM", "Ship weekly status rhythm", 6, "green"],
      ["Process note", "5:30 PM", "Reduce weekly blockers", 3, "violet"],
    ],
  },
];

const goalMeta = {
  1: {
    target: "Ship beta by July 12",
    next: "Finalize activation checklist",
    cadence: "Weekly review",
    linkedProject: "Product Development",
  },
  2: {
    target: "100km this month",
    next: "Schedule three recovery runs",
    cadence: "Every morning",
    linkedProject: "Personal",
  },
  3: {
    target: "20 books this year",
    next: "Finish current chapter notes",
    cadence: "Nightly",
    linkedProject: "Personal",
  },
  4: {
    target: "Daily mindfulness",
    next: "Keep 10-minute reset after work",
    cadence: "Daily",
    linkedProject: "Personal",
  },
};

const goalIconMap = {
  goal: Goal,
  gauge: Gauge,
  book: BookOpen,
  sparkles: Sparkles,
  target: Target,
  check: CheckCircle2,
};

const goalScopeOptions = [
  {
    value: "Day",
    label: "Day goal",
    detail: "Win today with one clear outcome.",
    color: "green",
    iconKey: "check",
    cadence: "Daily check-in",
    defaultArea: "Personal",
    goalPlaceholder: "Finish today's launch checklist",
    targetPlaceholder: "Complete the launch checklist before 6 PM",
    nextPlaceholder: "Block the first focused work session",
  },
  {
    value: "Month",
    label: "Month goal",
    detail: "Build momentum across a sprint.",
    color: "blue",
    iconKey: "gauge",
    cadence: "Weekly milestone review",
    defaultArea: "Health",
    goalPlaceholder: "Run 100km this month",
    targetPlaceholder: "Reach 100km by month end",
    nextPlaceholder: "Schedule this week's runs",
  },
  {
    value: "Year",
    label: "Year goal",
    detail: "Track the bigger outcome over time.",
    color: "violet",
    iconKey: "target",
    cadence: "Monthly strategy review",
    defaultArea: "Product Development",
    goalPlaceholder: "Launch new product",
    targetPlaceholder: "Ship the public beta by July 12",
    nextPlaceholder: "Finalize the beta launch checklist",
  },
];

const linkedAreaOptions = [
  "Personal",
  "Product Development",
  "Growth",
  "Marketing",
  "Operations",
  "Health",
  "Learning",
  "Finance",
  "Other",
];

const checkInFocusOptions = [
  { value: "30m", label: "30m", detail: "Quick reset" },
  { value: "1h", label: "1h", detail: "Focused block" },
  { value: "2h", label: "2h", detail: "Deep work" },
  { value: "3h", label: "3h", detail: "Strong session" },
  { value: "4h+", label: "4h+", detail: "Long push" },
];
const checkInEnergyOptions = ["Low", "Steady", "High"];
const taskPriorityOptions = [
  { value: "High", label: "High", detail: "Needs attention" },
  { value: "Medium", label: "Medium", detail: "Planned work" },
  { value: "Low", label: "Low", detail: "Later queue" },
];
const taskCategoryOptions = ["Focus", "Planning", "Routine", "Meeting", "Creation", "Health", "Study", "Review", "Operations"].map((option) => ({
  value: option,
  label: option,
}));
const focusTimerPresets = [
  {
    id: "pomodoro",
    label: "Pomodoro",
    minutes: 25,
    detail: "25 min focus, 5 min reset",
  },
  {
    id: "sprint",
    label: "Quick sprint",
    minutes: 15,
    detail: "Clear one small task",
  },
  {
    id: "flow52",
    label: "52/17 flow",
    minutes: 52,
    detail: "Longer work, real break",
  },
  {
    id: "deep",
    label: "Deep work",
    minutes: 90,
    detail: "Protect a serious block",
  },
];
const avatarMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxAvatarFileBytes = 5 * 1024 * 1024;

function getGoalIcon(goal) {
  return goalIconMap[goal.iconKey] ?? Goal;
}

function getGoalMeta(goal) {
  return goal.meta ?? goalMeta[goal.id] ?? {
    target: "Define the target outcome",
    next: "Choose the next action",
    cadence: `${goal.scope ?? "Goal"} review`,
    linkedProject: "Personal",
  };
}

function clampProgress(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getTaskGoalId(task) {
  return task.goalId ? String(task.goalId) : "";
}

function isTaskLinkedToGoal(task, goal) {
  const meta = getGoalMeta(goal);
  const explicitGoalId = getTaskGoalId(task);
  if (explicitGoalId || task.linkedGoal) {
    return explicitGoalId === String(goal.id) || task.linkedGoal === goal.label;
  }
  return task.project === meta.linkedProject;
}

function isCheckInLinkedToGoal(checkIn, goal) {
  const meta = getGoalMeta(goal);
  const value = checkIn.value ?? "";
  if (checkIn.goalId || checkIn.linkedGoal) {
    return String(checkIn.goalId ?? "") === String(goal.id) || checkIn.linkedGoal === goal.label;
  }
  return (
    value.includes(goal.label) ||
    value.includes(meta.linkedProject)
  );
}

function getHabitDayIndex(date = getToday()) {
  return (date.getDay() + 6) % 7;
}

function deriveGoalProgress(goals, tasks, habits, checkIns) {
  return goals.map((goal) => {
    const relatedTasks = tasks.filter((task) => isTaskLinkedToGoal(task, goal));
    const completedTasks = relatedTasks.filter((task) => task.completed);
    const relatedHabits = habits.filter((habit) => habit.goal === goal.label || habit.goalId === goal.id);
    const relatedCheckIns = checkIns.filter((checkIn) => isCheckInLinkedToGoal(checkIn, goal));
    const totalHabitChecks = relatedHabits.reduce((sum, habit) => sum + habit.checks.length, 0);
    const completedHabitChecks = relatedHabits.reduce((sum, habit) => sum + habit.checks.filter(Boolean).length, 0);
    const taskRate = relatedTasks.length ? (completedTasks.length / relatedTasks.length) * 100 : goal.progress;
    const habitRate = totalHabitChecks ? (completedHabitChecks / totalHabitChecks) * 100 : goal.progress;
    const checkInBoost = Math.min(100, relatedCheckIns.length * 18);
    const hasLoopSignals = relatedTasks.length || relatedHabits.length || relatedCheckIns.length;
    const progress = hasLoopSignals
      ? clampProgress(goal.progress * 0.35 + taskRate * 0.38 + habitRate * 0.2 + checkInBoost * 0.07)
      : goal.progress;

    return {
      ...goal,
      progress,
      rawProgress: goal.progress,
      loop: {
        relatedTasks: relatedTasks.length,
        completedTasks: completedTasks.length,
        relatedHabits: relatedHabits.length,
        habitRate: clampProgress(habitRate),
        checkInCount: relatedCheckIns.length,
      },
    };
  });
}

const days = ["M", "T", "W", "T", "F", "S", "S"];
const hours = ["7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM"];
const shortWeekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const longWeekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const monthYearFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const monthDayFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const fullDateFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return startOfDay(next);
}

function addMonths(date, amount) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return startOfDay(next);
}

function getToday() {
  return startOfDay(new Date());
}

function startOfWeek(date) {
  const normalized = startOfDay(date);
  const mondayOffset = (normalized.getDay() + 6) % 7;
  return addDays(normalized, -mondayOffset);
}

function isSameDate(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function getDateKey(date) {
  const value = startOfDay(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function dateFromKey(dateKey) {
  const [year, month, day] = String(dateKey).split("-").map(Number);
  return startOfDay(new Date(year, month - 1, day));
}

function formatTaskDate(task) {
  return task.dateKey ? monthDayFormatter.format(dateFromKey(task.dateKey)) : "Unscheduled";
}

function getTaskDate(task) {
  return task.dateKey ? dateFromKey(task.dateKey) : getToday();
}

function isDateInRange(date, start, end) {
  const time = startOfDay(date).getTime();
  return time >= startOfDay(start).getTime() && time <= startOfDay(end).getTime();
}

function getWeekDateKeyByIndex(index, anchorDate = getToday()) {
  return getDateKey(addDays(startOfWeek(anchorDate), index % 7));
}

function buildOnboardingWorkspace(profileId) {
  const profile = onboardingOptions.find((option) => option.id === profileId) ?? onboardingOptions[0];
  const taskDateKeys = [0, 1, 2, 3, 4, 4];
  const tasks = profile.tasks.map(([title, project, start, end, category, color, priority], index) => ({
    id: Date.now() + index,
    title,
    project,
    start,
    end,
    category,
    color,
    completed: index === 0,
    notes: `${profile.label} starter block created from onboarding.`,
    reminder: index < 3,
    priority,
    dateKey: getWeekDateKeyByIndex(taskDateKeys[index] ?? index),
  }));
  const goals = profile.goals.map(([label, progress, color, iconKey, scope, target, next, linkedProject], index) => ({
    id: Date.now() + 100 + index,
    label,
    progress,
    color,
    iconKey,
    scope,
    meta: {
      target,
      next,
      cadence: scope === "Month" ? "Weekly milestone review" : "Daily check-in",
      linkedProject,
    },
  }));
  const habits = profile.habits.map(([name, cue, goal, streak, color], index) => ({
    id: Date.now() + 200 + index,
    name,
    cue,
    goal,
    streak,
    color,
    checks: [true, true, true, index !== 1, true, false, false],
  }));

  return {
    tasks: tasks.sort(compareTasksBySchedule),
    goals,
    habits,
    inbox: profile.inbox,
    reminders: [
      { id: Date.now() + 300, title: "Daily plan", detail: "Every weekday, 8:00 AM", enabled: true },
      { id: Date.now() + 301, title: "Focus start", detail: "Before your first deep work block", enabled: true },
      { id: Date.now() + 302, title: "Evening review", detail: "Daily, 6:00 PM", enabled: true },
      { id: Date.now() + 303, title: "Weekly review", detail: "Every Sunday, 4:00 PM", enabled: true },
    ],
    checkIns: [
      { id: Date.now() + 400, when: "Today", value: `${profile.label} workspace created` },
      { id: Date.now() + 401, when: "Next check-in", value: "Reflect on focus, blockers, and energy" },
    ],
  };
}

function formatTimeFromMinutes(minutes) {
  const boundedMinutes = Math.max(0, Math.min(23 * 60 + 59, Math.round(minutes)));
  const hoursValue = Math.floor(boundedMinutes / 60);
  const minutesValue = boundedMinutes % 60;
  return `${String(hoursValue).padStart(2, "0")}:${String(minutesValue).padStart(2, "0")}`;
}

function snapToQuarterHour(minutes) {
  return Math.round(minutes / 15) * 15;
}

function compareTasksBySchedule(a, b) {
  const dateCompare = (a.dateKey ?? "").localeCompare(b.dateKey ?? "");
  return dateCompare || timeToMinutes(a.start) - timeToMinutes(b.start);
}

function normalizeTaskDates(tasks, anchorDate = getToday()) {
  let changed = false;
  const normalized = tasks.map((task, index) => {
    if (task.dateKey) return task;
    changed = true;
    return { ...task, dateKey: getWeekDateKeyByIndex(index, anchorDate) };
  });
  return changed ? normalized.sort(compareTasksBySchedule) : tasks;
}

function formatWeekRange(startDate) {
  const start = startOfDay(startDate);
  const end = addDays(start, 6);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${monthYearFormatter.format(start).replace(String(start.getFullYear()), "").trim()} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${monthDayFormatter.format(start)} - ${monthDayFormatter.format(end)}, ${start.getFullYear()}`;
  }
  return `${monthDayFormatter.format(start)}, ${start.getFullYear()} - ${monthDayFormatter.format(end)}, ${end.getFullYear()}`;
}

function getCalendarDays(anchorDate, selectedDate = anchorDate) {
  const today = getToday();
  const weekStart = startOfWeek(anchorDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    return {
      date,
      key: getDateKey(date),
      short: shortWeekdayFormatter.format(date),
      dateNumber: String(date.getDate()),
      label: longWeekdayFormatter.format(date),
      isToday: isSameDate(date, today),
      isSelected: isSameDate(date, selectedDate),
    };
  });
}

function formatDbTime(value, fallback = "09:00") {
  if (!value) return fallback;
  return String(value).slice(0, 5);
}

function toTitleCase(value, fallback = "") {
  if (!value) return fallback;
  return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase();
}

function getUserDisplayName(user, profile) {
  return (
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "there"
  );
}

function getInitials(name, email) {
  const source = name && name !== "there" ? name : email ?? "M";
  const parts = String(source).replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "M";
}

function getUserMetadataAvatar(user) {
  const metadata = user?.user_metadata ?? {};
  const identityData = user?.identities?.find((identity) => identity?.identity_data)?.identity_data ?? {};

  return (
    metadata.avatar_url ||
    metadata.picture ||
    metadata.photo_url ||
    identityData.avatar_url ||
    identityData.picture ||
    identityData.photo_url ||
    ""
  );
}

function getViewerAvatarUrl(user, profile) {
  return getAvatarPublicUrl(profile?.avatar_path) || getUserMetadataAvatar(user);
}

function validateAvatarFile(file) {
  if (!file) return "Choose an image first.";
  if (!avatarMimeTypes.has(file.type)) return "Use a PNG, JPG, WEBP, or GIF image.";
  if (file.size > maxAvatarFileBytes) return "Keep profile photos under 5MB.";
  return "";
}

function buildViewer(user, profile) {
  const name = getUserDisplayName(user, profile);
  return {
    id: user?.id ?? "",
    name,
    email: user?.email ?? "No email",
    initials: getInitials(name, user?.email),
    avatarPath: profile?.avatar_path ?? "",
    avatarUrl: getViewerAvatarUrl(user, profile),
    plan: "Free Plan",
  };
}

function UserAvatar({ viewer, className = "", large = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const avatarUrl = !imageFailed ? viewer?.avatarUrl : "";
  const classes = ["profileAvatar", large ? "large" : "", avatarUrl ? "hasImage" : "", className].filter(Boolean).join(" ");

  useEffect(() => {
    setImageFailed(false);
  }, [viewer?.avatarUrl]);

  return (
    <span className={classes} aria-hidden="true">
      {avatarUrl ? (
        <img src={avatarUrl} alt="" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} />
      ) : (
        viewer?.initials ?? "M"
      )}
    </span>
  );
}

function createAreaLookup(areas = []) {
  const byId = new Map(areas.map((area) => [area.id, area]));
  const byName = new Map(areas.map((area) => [area.name, area]));
  return { byId, byName };
}

function mapSupabaseTask(row, areasById, goalsById, habitsById) {
  const area = areasById.get(row.area_id);
  const goal = goalsById.get(row.goal_id);
  const habit = habitsById.get(row.habit_id);
  const start = formatDbTime(row.start_time);
  const end = formatDbTime(row.end_time, formatTimeFromMinutes(timeToMinutes(start) + 60));

  return {
    id: row.id,
    title: row.title,
    project: area?.name ?? row.category ?? "Personal",
    start,
    end,
    category: row.category ?? "Focus",
    color: row.color ?? area?.color ?? "blue",
    completed: row.status === "completed",
    notes: row.notes ?? "",
    reminder: row.reminder_enabled,
    priority: toTitleCase(row.priority, "Medium"),
    dateKey: row.scheduled_date ?? getDateKey(getToday()),
    goalId: row.goal_id,
    linkedGoal: goal?.title ?? "",
    habitId: row.habit_id,
    linkedHabit: habit?.name ?? "",
  };
}

function mapSupabaseGoal(row, areasById) {
  const area = areasById.get(row.area_id);
  const scope = toTitleCase(row.scope, "Month");
  return {
    id: row.id,
    label: row.title,
    progress: row.progress ?? 0,
    color: row.color ?? "blue",
    iconKey: row.icon_key ?? "target",
    scope,
    meta: {
      target: row.target_outcome ?? "Define the target outcome",
      next: row.next_action ?? "Choose the next action",
      cadence: scope === "Year" ? "Monthly strategy review" : scope === "Day" ? "Daily check-in" : "Weekly milestone review",
      linkedProject: area?.name ?? "Personal",
    },
  };
}

function mapSupabaseHabit(row, areasById, goalsById, habitEntries = []) {
  const goal = goalsById.get(row.goal_id);
  const area = areasById.get(row.area_id);
  const weekStart = startOfWeek(getToday());
  const entryByDate = new Map(habitEntries.filter((entry) => entry.habit_id === row.id).map((entry) => [entry.entry_date, entry]));

  return {
    id: row.id,
    name: row.name,
    cue: formatDbTime(row.cue_time, "09:00"),
    goal: goal?.title ?? area?.name ?? "Personal",
    goalId: row.goal_id,
    streak: row.streak ?? 0,
    color: row.color ?? "blue",
    checks: Array.from({ length: 7 }, (_, index) => Boolean(entryByDate.get(getDateKey(addDays(weekStart, index)))?.completed)),
  };
}

function mapSupabaseReminder(row) {
  const date = row.remind_at ? new Date(row.remind_at) : null;
  return {
    id: row.id,
    title: row.title,
    detail: date ? date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Scheduled reminder",
    enabled: row.enabled,
  };
}

function mapSupabaseCheckIn(row, tasksById, goalsById, habitsById) {
  const task = tasksById.get(row.task_id);
  const goal = goalsById.get(row.goal_id);
  const habit = habitsById.get(row.habit_id);
  const when = row.checked_in_at ? new Date(row.checked_in_at).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Recently";
  const focus = row.focus_minutes ? `${formatDuration(row.focus_minutes)} focused` : "Work check-in";
  const energy = row.energy ? ` - ${toTitleCase(row.energy)} energy` : "";
  const reflection = row.reflection ? ` - ${row.reflection}` : "";

  return {
    id: row.id,
    when,
    value: `${focus}${energy}${reflection}`,
    checkedInAt: row.checked_in_at,
    focusMinutes: row.focus_minutes ?? 0,
    taskId: row.task_id,
    linkedTask: task?.title ?? "",
    goalId: row.goal_id,
    linkedGoal: goal?.title ?? "",
    habitId: row.habit_id,
    linkedHabit: habit?.name ?? "",
  };
}

function mapWorkspaceSnapshot(snapshot, user) {
  const profile = snapshot.profile.data;
  const areas = snapshot.areas.data ?? [];
  const goalRows = snapshot.goals.data ?? [];
  const habitRows = snapshot.habits.data ?? [];
  const taskRows = snapshot.tasks.data ?? [];
  const habitEntryRows = snapshot.habitEntries.data ?? [];
  const { byId: areasById } = createAreaLookup(areas);
  const goalsById = new Map(goalRows.map((goal) => [goal.id, goal]));
  const habitsById = new Map(habitRows.map((habit) => [habit.id, habit]));
  const tasksById = new Map(taskRows.map((task) => [task.id, task]));

  return {
    viewer: buildViewer(user, profile),
    areas,
    tasks: taskRows.map((task) => mapSupabaseTask(task, areasById, goalsById, habitsById)).sort(compareTasksBySchedule),
    goals: goalRows.map((goal) => mapSupabaseGoal(goal, areasById)),
    habits: habitRows.map((habit) => mapSupabaseHabit(habit, areasById, goalsById, habitEntryRows)),
    reminders: (snapshot.reminders.data ?? []).map(mapSupabaseReminder),
    checkIns: (snapshot.checkIns.data ?? []).map((checkIn) => mapSupabaseCheckIn(checkIn, tasksById, goalsById, habitsById)),
  };
}

function toTaskInsert(task, area) {
  return {
    area_id: area?.id ?? null,
    title: task.title,
    notes: task.notes ?? null,
    scheduled_date: task.dateKey ?? getDateKey(getToday()),
    start_time: task.start ?? null,
    end_time: task.end ?? null,
    priority: String(task.priority ?? "Medium").toLowerCase(),
    category: task.category ?? null,
    color: task.color ?? area?.color ?? "blue",
    status: task.completed ? "completed" : "scheduled",
    reminder_enabled: Boolean(task.reminder),
    completed_at: task.completed ? new Date().toISOString() : null,
    goal_id: task.goalId ?? null,
    habit_id: task.habitId ?? null,
  };
}

function toGoalInsert(goal, area) {
  const meta = getGoalMeta(goal);
  return {
    area_id: area?.id ?? null,
    title: goal.label,
    scope: String(goal.scope ?? "Month").toLowerCase(),
    target_outcome: meta.target,
    next_action: meta.next,
    progress: goal.progress ?? 0,
    color: goal.color ?? area?.color ?? "blue",
    icon_key: goal.iconKey ?? "target",
    status: "active",
  };
}

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Local persistence is an enhancement; the web app still works without it.
    }
  }, [key, value]);

  return [value, setValue];
}

function getRouteFromHash() {
  const hash = window.location.hash || routeMap.landing;
  const match = Object.entries(routeMap).find(([, route]) => route === hash);
  return match ? match[0] : "landing";
}

function getHashForRoute(view) {
  return routeMap[view] ?? routeMap.landing;
}

function timeToMinutes(time) {
  const [hoursValue, minutesValue] = time.split(":").map(Number);
  return hoursValue * 60 + minutesValue;
}

function parseCueTime(cue, fallback = "09:00") {
  const match = String(cue).match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (!match) return fallback;
  let hoursValue = Number(match[1]);
  const minutesValue = Number(match[2] ?? 0);
  const period = match[3]?.toUpperCase();
  if (period === "PM" && hoursValue < 12) hoursValue += 12;
  if (period === "AM" && hoursValue === 12) hoursValue = 0;
  return `${String(hoursValue).padStart(2, "0")}:${String(minutesValue).padStart(2, "0")}`;
}

function minutesBetween(start, end) {
  return Math.max(15, timeToMinutes(end) - timeToMinutes(start));
}

function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hrs) return `${mins}m`;
  return mins ? `${hrs}h ${mins}m` : `${hrs}h`;
}

function formatTimerDisplay(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function normalizeFocusTargetMinutes(value) {
  const numeric = Number.parseInt(value ?? focusTimerPresets[0].minutes, 10);
  return Math.max(1, Math.min(180, Number.isFinite(numeric) ? numeric : focusTimerPresets[0].minutes));
}

function getFocusTimerMeta(focusTimer) {
  const targetMinutes = normalizeFocusTargetMinutes(focusTimer?.targetMinutes);
  const elapsedSeconds = Math.max(0, focusTimer?.elapsedSeconds ?? 0);
  const targetSeconds = Math.max(60, targetMinutes * 60);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const progress = clampPercent((elapsedSeconds / targetSeconds) * 100);

  return {
    display: formatTimerDisplay(elapsedSeconds),
    elapsedMinutes,
    elapsedSeconds,
    isComplete: elapsedSeconds >= targetSeconds,
    progress,
    remainingMinutes: Math.max(0, targetMinutes - elapsedMinutes),
    targetDisplay: formatTimerDisplay(targetSeconds),
    targetMinutes,
    targetSeconds,
  };
}

function parseFocusMinutes(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return 0;
  const hourMatch = raw.match(/(\d+(?:\.\d+)?)\s*h/i);
  const minuteMatch = raw.match(/(\d+)\s*m/i);
  if (raw.endsWith("+")) return Number.parseInt(raw, 10) * 60 || 0;
  if (hourMatch || minuteMatch) {
    return Math.round((Number.parseFloat(hourMatch?.[1] ?? "0") * 60) + Number.parseInt(minuteMatch?.[1] ?? "0", 10));
  }
  const numeric = Number.parseFloat(raw);
  return Number.isFinite(numeric) ? Math.round(numeric * 60) : 0;
}

function getCheckInDate(checkIn) {
  if (checkIn.checkedInAt) return new Date(checkIn.checkedInAt);
  if (checkIn.when === "Just now" || checkIn.when === "Today") return getToday();
  if (checkIn.when === "Yesterday") return addDays(getToday(), -1);
  const parsed = new Date(checkIn.when);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getCheckInFocusMinutes(checkIn) {
  if (Number.isFinite(checkIn.focusMinutes)) return checkIn.focusMinutes;
  const value = checkIn.value ?? "";
  const hourMatch = value.match(/(\d+)\s*h/i);
  const minuteMatch = value.match(/(\d+)\s*m/i);
  return (Number.parseInt(hourMatch?.[1] ?? "0", 10) * 60) + Number.parseInt(minuteMatch?.[1] ?? "0", 10);
}

function isFocusCategory(category) {
  const value = String(category ?? "").toLowerCase();
  return value.includes("focus") || value.includes("deep") || value.includes("planning");
}

function isMeetingCategory(category) {
  return String(category ?? "").toLowerCase().includes("meeting");
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatDelta(value, suffix = "") {
  const rounded = Math.abs(value) >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  if (!value) return { text: `0${suffix} vs last week`, tone: "neutral" };
  return {
    text: `${value > 0 ? "+" : "-"}${Math.abs(rounded)}${suffix} vs last week`,
    tone: value > 0 ? "positive" : "negative",
  };
}

function buildDailySeries(tasks, weekStart, metric) {
  return Array.from({ length: 7 }, (_, index) => {
    const dateKey = getDateKey(addDays(weekStart, index));
    const dayTasks = tasks.filter((task) => (task.dateKey ?? getDateKey(getToday())) === dateKey);
    if (metric === "focus") {
      return Math.min(100, Math.round(dayTasks.filter((task) => isFocusCategory(task.category)).reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0) / 3));
    }
    if (metric === "meetings") {
      return Math.min(100, Math.round(dayTasks.filter((task) => isMeetingCategory(task.category)).reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0) / 3));
    }
    if (!dayTasks.length) return 0;
    const completed = dayTasks.filter((task) => task.completed).length;
    return clampPercent((completed / dayTasks.length) * 100);
  });
}

function buildCheckInFocusSeries(checkIns, weekStart) {
  return Array.from({ length: 7 }, (_, index) => {
    const dateKey = getDateKey(addDays(weekStart, index));
    const minutes = checkIns
      .filter((checkIn) => {
        const date = getCheckInDate(checkIn);
        return date ? getDateKey(date) === dateKey : false;
      })
      .reduce((sum, checkIn) => sum + getCheckInFocusMinutes(checkIn), 0);
    return Math.min(100, Math.round(minutes / 3));
  });
}

function getBestFocusWindow(tasks) {
  const focusTasks = tasks.filter((task) => isFocusCategory(task.category));
  if (!focusTasks.length) {
    return {
      label: "No focus window yet",
      detail: "Schedule focus blocks to find your best time",
      bars: [0, 0, 0, 0, 0, 0, 0],
      hasData: false,
    };
  }

  const buckets = new Map();
  focusTasks.forEach((task) => {
    const startHour = Math.floor(timeToMinutes(task.start) / 60);
    const key = Math.max(6, Math.min(20, startHour));
    buckets.set(key, (buckets.get(key) ?? 0) + minutesBetween(task.start, task.end));
  });

  const bestStart = [...buckets.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 9;
  const bestEnd = Math.min(bestStart + 3, 23);
  const bars = Array.from({ length: 7 }, (_, index) => {
    const hour = 7 + index * 2;
    return Math.min(100, Math.round(((buckets.get(hour) ?? 0) / 180) * 100));
  });

  return {
    label: `${formatTimeFromMinutes(bestStart * 60)} - ${formatTimeFromMinutes(bestEnd * 60)}`,
    detail: `${formatDuration(buckets.get(bestStart) ?? 0)} scheduled in this window`,
    bars,
    hasData: true,
  };
}

function buildTimeDistribution(tasks) {
  const totals = tasks.reduce(
    (acc, task) => {
      const minutes = minutesBetween(task.start, task.end);
      if (isFocusCategory(task.category)) acc.deep += minutes;
      else if (isMeetingCategory(task.category)) acc.meetings += minutes;
      else acc.shallow += minutes;
      acc.total += minutes;
      return acc;
    },
    { deep: 0, meetings: 0, shallow: 0, breaks: 0, total: 0 },
  );

  const toPercent = (minutes) => (totals.total ? clampPercent((minutes / totals.total) * 100) : 0);
  return {
    total: totals.total,
    items: [
      { label: "Deep Work", key: "deep", className: "blue", value: toPercent(totals.deep), minutes: totals.deep },
      { label: "Meetings", key: "meetings", className: "slate", value: toPercent(totals.meetings), minutes: totals.meetings },
      { label: "Shallow Work", key: "shallow", className: "green", value: toPercent(totals.shallow), minutes: totals.shallow },
      { label: "Breaks", key: "breaks", className: "pale", value: toPercent(totals.breaks), minutes: totals.breaks },
    ],
  };
}

function getDonutBackground(distribution) {
  if (!distribution.total) return "conic-gradient(var(--donut-empty) 0 100%)";
  let cursor = 0;
  const colorByKey = {
    deep: "var(--blue)",
    meetings: "var(--donut-meeting)",
    shallow: "var(--green)",
    breaks: "var(--donut-breaks)",
  };
  const stops = distribution.items.map((item) => {
    const start = cursor;
    cursor += item.value;
    return `${colorByKey[item.key]} ${start}% ${cursor}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function buildWeeklyInsight(analytics) {
  if (!analytics.hasActivity) {
    return {
      title: "Ready when you are",
      body: "Add a task, complete work, or log a check-in and Mark will build your weekly insight from real activity.",
      kicker: "No activity yet",
    };
  }

  if (analytics.completion >= 80 && analytics.focusMinutes > 0) {
    return {
      title: "Strong delivery week",
      body: `${analytics.completion}% task completion with ${analytics.focusHours} focus hours. Keep protecting the blocks that are working.`,
      kicker: "High momentum",
    };
  }

  if (analytics.focusMinutes > 0 && analytics.completion < 50) {
    return {
      title: "Focus is building",
      body: `${analytics.focusHours} focus hours are scheduled, but completion is ${analytics.completion}%. Close or reschedule open tasks to clean the week.`,
      kicker: "Needs closure",
    };
  }

  if (analytics.checkInCount > 0) {
    return {
      title: "Reflection signal found",
      body: `${analytics.checkInCount} check-in${analytics.checkInCount === 1 ? "" : "s"} captured. Link them to goals or tasks to make the analytics sharper.`,
      kicker: "Check-ins active",
    };
  }

  return {
    title: "Plan the next block",
    body: `${analytics.tasksTotal} task${analytics.tasksTotal === 1 ? "" : "s"} scheduled this week. Complete the first one to start the productivity trend.`,
    kicker: "Work planned",
  };
}

function calculateProductivityScore({ completion, focusMinutes, habitCompletion, goalAverage, checkInCount, hasActivity }) {
  if (!hasActivity) return 0;
  const focusScore = clampPercent((focusMinutes / (20 * 60)) * 100);
  const checkInScore = clampPercent((checkInCount / 5) * 100);
  return clampPercent(completion * 0.35 + focusScore * 0.25 + habitCompletion * 0.2 + goalAverage * 0.15 + checkInScore * 0.05);
}

function buildWorkspaceAnalytics(tasks, habits, goals, checkIns) {
  const weekStart = startOfWeek(getToday());
  const weekEnd = addDays(weekStart, 6);
  const previousWeekStart = addDays(weekStart, -7);
  const previousWeekEnd = addDays(weekStart, -1);
  const currentWeekTasks = tasks.filter((task) => isDateInRange(getTaskDate(task), weekStart, weekEnd));
  const previousWeekTasks = tasks.filter((task) => isDateInRange(getTaskDate(task), previousWeekStart, previousWeekEnd));
  const currentCheckIns = checkIns.filter((checkIn) => {
    const date = getCheckInDate(checkIn);
    return date ? isDateInRange(date, weekStart, weekEnd) : false;
  });
  const completedTasks = currentWeekTasks.filter((task) => task.completed).length;
  const previousCompletedTasks = previousWeekTasks.filter((task) => task.completed).length;
  const completion = currentWeekTasks.length ? clampPercent((completedTasks / currentWeekTasks.length) * 100) : 0;
  const previousCompletion = previousWeekTasks.length ? clampPercent((previousCompletedTasks / previousWeekTasks.length) * 100) : 0;
  const scheduledFocusMinutes = currentWeekTasks.filter((task) => isFocusCategory(task.category)).reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0);
  const previousFocusMinutes = previousWeekTasks.filter((task) => isFocusCategory(task.category)).reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0);
  const loggedFocusMinutes = currentCheckIns.reduce((sum, checkIn) => sum + getCheckInFocusMinutes(checkIn), 0);
  const focusMinutes = scheduledFocusMinutes + loggedFocusMinutes;
  const habitChecks = habits.reduce((sum, habit) => sum + habit.checks.length, 0);
  const completedHabitChecks = habits.reduce((sum, habit) => sum + habit.checks.filter(Boolean).length, 0);
  const habitCompletion = habitChecks ? clampPercent((completedHabitChecks / habitChecks) * 100) : 0;
  const goalAverage = goals.length ? clampPercent(goals.reduce((sum, goal) => sum + (goal.progress ?? 0), 0) / goals.length) : 0;
  const hasActivity = Boolean(currentWeekTasks.length || habits.length || goals.length || currentCheckIns.length || focusMinutes);
  const score = calculateProductivityScore({
    completion,
    focusMinutes,
    habitCompletion,
    goalAverage,
    checkInCount: currentCheckIns.length,
    hasActivity,
  });
  const previousScore = calculateProductivityScore({
    completion: previousCompletion,
    focusMinutes: previousFocusMinutes,
    habitCompletion: 0,
    goalAverage: 0,
    checkInCount: 0,
    hasActivity: Boolean(previousWeekTasks.length || previousFocusMinutes),
  });
  const distribution = buildTimeDistribution(currentWeekTasks);
  const bestFocusWindow = getBestFocusWindow(currentWeekTasks);
  const scoreDelta = formatDelta(score - previousScore);
  const focusDelta = formatDelta((focusMinutes - previousFocusMinutes) / 60, " hrs");
  const completionDelta = formatDelta(completion - previousCompletion, "%");
  const scheduledFocusTrend = buildDailySeries(currentWeekTasks, weekStart, "focus");
  const checkInFocusTrend = buildCheckInFocusSeries(currentCheckIns, weekStart);
  const focusTrend = scheduledFocusTrend.map((value, index) => Math.min(100, value + checkInFocusTrend[index]));
  const completionTrend = buildDailySeries(currentWeekTasks, weekStart, "completion");
  const scoreTrend = completionTrend.map((value, index) => clampPercent(value * 0.65 + focusTrend[index] * 0.35));
  const meetingTrend = buildDailySeries(currentWeekTasks, weekStart, "meetings");

  const analytics = {
    hasActivity,
    score,
    completion,
    focusMinutes,
    focusHours: (focusMinutes / 60).toFixed(1),
    habitCompletion,
    goalAverage,
    checkInCount: currentCheckIns.length,
    tasksTotal: currentWeekTasks.length,
    tasksCompleted: completedTasks,
    meetingMinutes: currentWeekTasks.filter((task) => isMeetingCategory(task.category)).reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0),
    scoreDelta,
    focusDelta,
    completionDelta,
    scoreTrend,
    focusTrend,
    completionTrend,
    meetingTrend,
    bestFocusWindow,
    distribution,
  };

  return {
    ...analytics,
    weeklyInsight: buildWeeklyInsight(analytics),
  };
}

function AppLogo() {
  return (
    <div className="brand" aria-label="Mark productivity web app">
      <img className="brandLogo" src={markLogoSrc} alt="" draggable="false" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="googleIcon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h6.5c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.2-2 3.6-4.9 3.6-8.2Z" />
      <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.8c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v2.9C3.7 21.4 7.5 24 12 24Z" />
      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V7.3H1.8C1 8.9.5 10.7.5 12.5s.5 3.6 1.3 5.2l3.8-2.9Z" />
      <path fill="#EA4335" d="M12 5.5c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 2.1 15.1 1 12 1 7.5 1 3.7 3.6 1.8 7.3l3.8 2.9c.9-2.7 3.4-4.7 6.4-4.7Z" />
    </svg>
  );
}

function IconButton({ label, children, className = "", ...props }) {
  return (
    <button className={`iconButton ${className}`} type="button" aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}

function WebButton({ children, variant = "primary", className = "", ...props }) {
  return (
    <button className={`webButton ${variant} ${className}`} type="button" {...props}>
      {children}
    </button>
  );
}

function normalizeSelectOptions(options) {
  return options.map((option) => {
    if (typeof option === "string") {
      return { value: option, label: option };
    }

    return {
      ...option,
      value: String(option.value),
      label: option.label ?? String(option.value),
    };
  });
}

function MarkSelect({ value, onChange, options, label, placeholder = "Choose an option", className = "" }) {
  const normalizedOptions = useMemo(() => normalizeSelectOptions(options), [options]);
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const selectedValue = value == null ? "" : String(value);
  const selectedIndex = normalizedOptions.findIndex((option) => option.value === selectedValue);
  const selectedOption = selectedIndex >= 0 ? normalizedOptions[selectedIndex] : null;

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const spaceBelow = viewportHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const openUp = spaceBelow < 180 && spaceAbove > spaceBelow;
    const maxHeight = Math.min(280, Math.max(150, openUp ? spaceAbove : spaceBelow));

    setMenuStyle({
      left: `${rect.left}px`,
      top: `${openUp ? Math.max(8, rect.top - maxHeight - 6) : rect.bottom + 6}px`,
      width: `${rect.width}px`,
      maxHeight: `${maxHeight}px`,
      "--select-origin": openUp ? "bottom" : "top",
    });
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    updateMenuPosition();

    const closeOnPointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen]);

  const chooseOption = (option) => {
    onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const stepOption = (direction) => {
    if (!normalizedOptions.length) return;
    const baseIndex = selectedIndex >= 0 ? selectedIndex : 0;
    const nextIndex = (baseIndex + direction + normalizedOptions.length) % normalizedOptions.length;
    onChange(normalizedOptions[nextIndex].value);
    setIsOpen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      stepOption(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      stepOption(-1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((current) => !current);
    }
  };

  return (
    <div className={`markSelect ${isOpen ? "open" : ""} ${className}`} ref={rootRef}>
      <button
        ref={triggerRef}
        className="markSelectTrigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span className="markSelectTriggerText">
          <span className={selectedOption ? "markSelectValue" : "markSelectValue placeholder"}>{selectedOption?.label ?? placeholder}</span>
          {selectedOption?.detail ? <small>{selectedOption.detail}</small> : null}
        </span>
        <ChevronDown className="markSelectChevron" size={17} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="markSelectMenu" role="listbox" aria-label={label} style={menuStyle}>
          {normalizedOptions.map((option) => {
            const active = option.value === selectedValue;
            return (
              <button
                key={option.value}
                className={`markSelectOption ${active ? "selected" : ""}`}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => chooseOption(option)}
              >
                <span>
                  <strong>{option.label}</strong>
                  {option.detail ? <small>{option.detail}</small> : null}
                </span>
                <Check className="markSelectCheck" size={15} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function PublicHeader({ onNavigate }) {
  return (
    <header className="webHeader">
      <AppLogo />
      <div className="webHeaderActions">
        <button type="button" className="webLoginLink" onClick={() => onNavigate("login")}>
          Log in
        </button>
        <WebButton onClick={() => onNavigate("signup")}>Get Mark free</WebButton>
      </div>
    </header>
  );
}

function LandingPage({ onNavigate }) {
  return (
    <main className="webPage">
      <section className="webHero">
        <PublicHeader onNavigate={onNavigate} />
        <div className="webHeroInner">
          <h1>
            Plan the day.{" "}
            <span>Prove the progress.</span>
          </h1>
          <p>Mark brings calendar, tasks, habits, goals, focus sessions, check-ins, and analytics into one calm workspace.</p>
          <div className="webHeroActions">
            <WebButton onClick={() => onNavigate("signup")}>
              Get Mark free
              <ArrowRight size={17} />
            </WebButton>
            <WebButton variant="ghost" onClick={() => onNavigate("login")}>
              Log in
            </WebButton>
          </div>
        </div>
        <ProductPreview />
        <div className="webProof" aria-label="Built for productive teams and individuals">
          <span>Built for serious momentum</span>
          <div className="webProofTrack">
            {["Founders", "Operators", "Students", "Creators", "Agencies"].map((audience) => (
              <strong key={audience}>{audience}</strong>
            ))}
          </div>
        </div>
      </section>

      <section className="webFeatureBand" aria-label="Mark features">
        <div className="webFeatureIntro">
          <h2>Everything productive people need in one place.</h2>
          <p>Schedule the work, finish the tasks, keep habits alive, and see the signal behind every week.</p>
        </div>
        <div className="webFeatureGrid">
          <MiniFeature icon={CalendarDays} title="Calendar" text="Drag time blocks into the week and keep tasks tied to real dates." />
          <MiniFeature icon={ListChecks} title="Tasks" text="Capture, prioritize, schedule, complete, and review the work queue." />
          <MiniFeature icon={Target} title="Goals" text="Connect daily action to monthly and yearly outcomes that make sense." />
          <MiniFeature icon={BarChart3} title="Analytics" text="Track focus hours, completion rate, habits, check-ins, and momentum." />
        </div>
      </section>
    </main>
  );
}

function MiniFeature({ icon: Icon, title, text }) {
  return (
    <article className="webFeature">
      <span>
        <Icon size={24} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function ProductPreview() {
  const previewWeek = [
    { day: "Mon", date: "22" },
    { day: "Tue", date: "23" },
    { day: "Wed", date: "24" },
    { day: "Thu", date: "25" },
    { day: "Fri", date: "26", today: true },
    { day: "Sat", date: "27" },
    { day: "Sun", date: "28" },
  ];
  const previewEvents = [
    { title: "Deep Work", time: "8:00 - 10:00", col: 1, top: 18, height: 14, color: "blue" },
    { title: "Team stand-up", time: "9:30 - 10:00", col: 2, top: 27, height: 9, color: "blue" },
    { title: "Client call", time: "10:30 - 11:15", col: 3, top: 36, height: 10, color: "amber" },
    { title: "Design sync", time: "1:00 - 2:00", col: 4, top: 54, height: 12, color: "blue" },
    { title: "Product review", time: "9:00 - 10:00", col: 5, top: 21, height: 13, color: "violet" },
    { title: "Focus session", time: "2:00 - 3:30", col: 5, top: 64, height: 17, color: "violet" },
    { title: "Workout", time: "5:00 - 6:00", col: 2, top: 86, height: 11, color: "green" },
  ];

  const movePreview = (event) => {
    const frame = event.currentTarget;
    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    frame.style.setProperty("--tilt-x", `${(-y * 7 + 6).toFixed(2)}deg`);
    frame.style.setProperty("--tilt-y", `${(x * 9 - 3).toFixed(2)}deg`);
    frame.style.setProperty("--shine-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    frame.style.setProperty("--shine-y", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const resetPreview = (event) => {
    const frame = event.currentTarget;
    frame.style.setProperty("--tilt-x", "6deg");
    frame.style.setProperty("--tilt-y", "-3deg");
    frame.style.setProperty("--shine-x", "58%");
    frame.style.setProperty("--shine-y", "18%");
  };

  return (
    <div className="webProductStage" onPointerMove={movePreview} onPointerLeave={resetPreview}>
      <div className="webProductFrame" aria-label="Mark workspace preview">
        <div className="webWindowBar">
          <span />
          <span />
          <span />
          <strong>Mark workspace</strong>
        </div>
        <div className="webWorkspaceMock">
          <aside className="webMockSidebar">
            <div className="webMockLogo">M</div>
            {["Overview", "Calendar", "Tasks", "Goals", "Focus", "Habits", "Analytics", "Check-ins"].map((item) => (
              <span key={item} className={item === "Overview" ? "active" : ""}>
                {item}
              </span>
            ))}
            <div className="webMockProjects">
              <strong>Projects</strong>
              {["Personal", "Work", "Learning", "Health"].map((item) => (
                <small key={item}>{item}</small>
              ))}
            </div>
          </aside>
          <section className="webMockCalendar">
            <div className="webMockToolbar">
              <div className="webMockToolbarCluster">
                <button type="button">Today</button>
                <button type="button" aria-label="Previous week">
                  <ChevronLeft size={13} />
                </button>
                <button type="button" aria-label="Next week">
                  <ChevronRight size={13} />
                </button>
              </div>
              <strong>Friday, June 26, 2026</strong>
              <label>
                <Search size={14} />
                <span>Search</span>
              </label>
            </div>
            <div className="webCalendarPreview" aria-label="Weekly calendar preview">
              <div className="webCalendarHeader">
                <span>GMT+1</span>
                {previewWeek.map((item) => (
                  <strong key={item.date} className={item.today ? "today" : ""}>
                    <small>{item.day}</small>
                    {item.date}
                  </strong>
                ))}
              </div>
              <div className="webCalendarCanvas">
                <div className="webTimeRail">
                  {["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"].map((time) => (
                    <span key={time}>{time}</span>
                  ))}
                </div>
                <div className="webCalendarLanes">
                  {previewWeek.map((item) => (
                    <span key={item.date} className={item.today ? "today" : ""} />
                  ))}
                  {previewEvents.map((event) => (
                    <article
                      key={`${event.title}-${event.time}`}
                      className={`webMockEvent ${event.color}`}
                      style={{
                        "--event-col": event.col,
                        "--event-top": `${event.top}%`,
                        "--event-height": `${event.height}%`,
                      }}
                    >
                      <strong>{event.title}</strong>
                      <span>{event.time}</span>
                    </article>
                  ))}
                  <div className="webNowLine" />
                </div>
              </div>
            </div>
          </section>
          <aside className="webMockInsight">
            <div className="webMockMetric">
              <span>Focus time</span>
              <strong>4h 32m</strong>
              <MiniBars values={[34, 51, 64, 73, 91, 44, 26]} />
            </div>
            <div className="webMockMetric">
              <span>Task completion</span>
              <strong>86%</strong>
              <Sparkline values={[42, 58, 55, 73, 62, 79, 86]} />
            </div>
            <div className="webMockList">
              <strong>Today&apos;s tasks</strong>
              {["Prepare roadmap", "Write investor update", "Read 20 pages"].map((task) => (
                <p key={task}>
                  <Check size={14} />
                  {task}
                </p>
              ))}
            </div>
            <div className="webMockGoals">
              <strong>Active goals</strong>
              <ProgressBar value={72} color="green" />
              <ProgressBar value={45} color="amber" />
              <ProgressBar value={33} color="blue" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function AuthPage({ mode, onNavigate, theme }) {
  const isSignup = mode === "signup";
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const title = isSignup ? "Create your Mark workspace" : "Log in to Mark";
  const subtitle = isSignup
    ? "Start with calendar, tasks, goals, habits, and analytics ready from day one."
    : "Welcome back. Pick up the plan, check the progress, and keep moving.";

  const submitAuth = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setAuthError("");
    setAuthNotice("");
    setIsSubmitting(true);

    try {
      const { data, error } = isSignup
        ? await signUpWithEmail({ email, password, fullName })
        : await signInWithEmail({ email, password });

      if (error) throw error;

      if (isSignup && !data.session) {
        setAuthNotice("Account created. Check your email to confirm it, then log in.");
        return;
      }

      onNavigate(isSignup ? "onboarding" : "app");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitGoogleAuth = async () => {
    setAuthError("");
    setAuthNotice("");
    setIsSubmitting(true);

    const { error } = await signInWithGoogle();
    if (error) {
      setAuthError(error.message);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingScreen theme={theme} isWorkspaceLoading />;
  }

  return (
    <main className="authPage">
      <button type="button" className="authBrand" onClick={() => onNavigate("landing")} aria-label="Back to Mark home">
        <AppLogo />
      </button>
      <section className="authPanel">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <form className="authForm" onSubmit={submitAuth}>
          {isSignup ? (
            <label>
              Name
              <span>
                <UserRound size={17} />
                <input type="text" name="name" placeholder="Your name" autoComplete="name" required />
              </span>
            </label>
          ) : null}
          <label>
            Email
            <span>
              <Mail size={17} />
              <input type="email" name="email" placeholder="alex@company.com" autoComplete="email" required />
            </span>
          </label>
          <label>
            Password
            <span>
              <LockKeyhole size={17} />
              <input type="password" name="password" placeholder="••••••••" autoComplete={isSignup ? "new-password" : "current-password"} required />
            </span>
          </label>
          <button type="submit" className="authSubmit" disabled={isSubmitting}>
            {isSubmitting ? "Working..." : isSignup ? "Create account" : "Log in"}
            <ArrowRight size={17} />
          </button>
        </form>
        <button type="button" className="authProviderButton" onClick={submitGoogleAuth} disabled={isSubmitting} aria-label="Sign in with Google">
          <span>Sign in with</span>
          <GoogleIcon />
        </button>
        {authError ? <p className="authMessage error">{authError}</p> : null}
        {authNotice ? <p className="authMessage">{authNotice}</p> : null}
        <div className="authSwitch">
          <span>{isSignup ? "Already have an account?" : "New to Mark?"}</span>
          <button type="button" onClick={() => onNavigate(isSignup ? "login" : "signup")}>
            {isSignup ? "Log in" : "Create account"}
          </button>
        </div>
      </section>
      <aside className="authAside">
        <ProductPreview />
      </aside>
    </main>
  );
}

function OnboardingPage({ onNavigate, onComplete }) {
  const [selectedProfileId, setSelectedProfileId] = useState(onboardingOptions[0].id);
  const selectedProfile = onboardingOptions.find((option) => option.id === selectedProfileId) ?? onboardingOptions[0];
  const SelectedIcon = selectedProfile.icon;

  const submitOnboarding = (event) => {
    event.preventDefault();
    onComplete(selectedProfileId);
  };

  return (
    <main className="onboardingPage">
      <button type="button" className="authBrand" onClick={() => onNavigate("landing")} aria-label="Back to Mark home">
        <AppLogo />
      </button>
      <form className="onboardingShell" onSubmit={submitOnboarding}>
        <section className="onboardingIntro">
          <span className="onboardingStep">Setup 1 of 1</span>
          <h1>What do you want Mark to help you improve first?</h1>
          <p>Pick the closest fit. Mark will create starter tasks, calendar blocks, goals, habits, and reminders around that workflow.</p>
        </section>

        <section className="onboardingGrid" role="radiogroup" aria-label="Choose your Mark workspace focus">
          {onboardingOptions.map((option) => {
            const OptionIcon = option.icon;
            const active = option.id === selectedProfileId;
            return (
              <button
                key={option.id}
                className={`onboardingCard ${active ? "active" : ""}`}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedProfileId(option.id)}
              >
                <span className={`onboardingIcon ${option.accent}`}>
                  <OptionIcon size={20} />
                </span>
                <strong>{option.label}</strong>
                <small>{option.detail}</small>
              </button>
            );
          })}
        </section>

        <aside className="onboardingPreview" aria-label={`${selectedProfile.label} workspace preview`}>
          <div className="onboardingPreviewHeader">
            <span className={`onboardingIcon ${selectedProfile.accent}`}>
              <SelectedIcon size={21} />
            </span>
            <div>
              <small>Your starter workspace</small>
              <strong>{selectedProfile.title}</strong>
            </div>
          </div>
          <div className="onboardingPreviewList">
            <div>
              <span>Calendar blocks</span>
              {selectedProfile.tasks.slice(0, 3).map(([title, , start]) => (
                <p key={`${title}-${start}`}>
                  <Clock3 size={14} />
                  {start} - {title}
                </p>
              ))}
            </div>
            <div>
              <span>Goals</span>
              {selectedProfile.goals.map(([label, progress, color]) => (
                <p key={label}>
                  <ProgressBar value={progress} color={color} />
                  {label}
                </p>
              ))}
            </div>
          </div>
          <button className="authSubmit onboardingSubmit" type="submit">
            Build my workspace
            <ArrowRight size={17} />
          </button>
          <button className="onboardingBack" type="button" onClick={() => onNavigate("signup")}>
            Back to signup
          </button>
        </aside>
      </form>
    </main>
  );
}

function ProgressBar({ value, color = "blue" }) {
  return (
    <div className="progressTrack" aria-label={`${value}% complete`}>
      <span className={`progressFill ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function MetricCard({ title, value, suffix, delta, deltaTone = "positive", children }) {
  return (
    <section className="metricCard" aria-label={title}>
      <div>
        <p>{title}</p>
        <strong>
          {value}
          {suffix && <span>{suffix}</span>}
        </strong>
        <small className={`metricDelta ${deltaTone}`}>{delta}</small>
      </div>
      {children}
    </section>
  );
}

function MiniBars({ values, color = "blue", labels = days }) {
  return (
    <div className={`miniBars ${color}`} aria-hidden="true">
      {values.map((value, index) => (
        <span key={`${value}-${index}`} style={{ height: `${value}%` }} title={`${labels[index]} ${value}%`} />
      ))}
    </div>
  );
}

function Sparkline({ values, color = "blue" }) {
  const width = 92;
  const height = 52;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / Math.max(1, max - min)) * (height - 12) - 6;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg className={`sparkline ${color}`} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={points} />
      {values.map((value, index) => {
        const x = (index / (values.length - 1)) * width;
        const y = height - ((value - min) / Math.max(1, max - min)) * (height - 12) - 6;
        return <circle key={`${value}-${index}`} cx={x} cy={y} r="2.6" />;
      })}
    </svg>
  );
}

function Ring({ value, label }) {
  return (
    <div className="ringWrap" aria-label={`${label}: ${value}%`}>
      <div className="ring" style={{ "--value": `${value}%` }}>
        <span>{value}</span>
      </div>
      <p>{label}</p>
    </div>
  );
}

function Sidebar({ goals, inbox, activeNav, setActiveNav, onAddTask, onAddGoal, onCollapse, viewer }) {
  return (
    <aside className="sidebar">
      <div className="sidebarHeader">
        <AppLogo />
        <IconButton label="Collapse sidebar" className="sidebarCollapseButton" onClick={onCollapse}>
          <PanelLeftClose size={18} />
        </IconButton>
      </div>

      <nav className="navList" aria-label="Primary">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={activeNav === item.label ? "active" : ""}
              type="button"
              onClick={() => setActiveNav(item.label)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sideSection">
        <div className="sectionHeading">
          <span>Inbox</span>
          <b>{inbox.length}</b>
        </div>
        <ul className="inboxList">
          {inbox.length === 0 ? (
            <li className="emptyLine">Your task inbox is clear.</li>
          ) : (
            inbox.map((item) => (
              <li key={item}>
                <Circle size={15} />
                <span>{item}</span>
              </li>
            ))
          )}
        </ul>
        <button className="linkButton" type="button" onClick={onAddTask}>
          <Plus size={15} />
          Add task
        </button>
      </div>

      <div className="sideSection goalsMini">
        <div className="sectionHeading">
          <span>Goals</span>
          <button className="sectionIconButton" type="button" onClick={onAddGoal} aria-label="Add goal">
            <Plus size={15} />
          </button>
        </div>
        {goals.map((goal) => {
          const GoalIcon = getGoalIcon(goal);
          return (
            <div className="goalMini" key={goal.id}>
              <span className={`goalIcon ${goal.color}`}>
                <GoalIcon size={15} />
              </span>
              <div>
                <div>
                  <span>{goal.label}</span>
                  <b>{goal.progress}%</b>
                </div>
                <ProgressBar value={goal.progress} color={goal.color} />
              </div>
            </div>
          );
        })}
        <button className="plainLink" type="button" onClick={() => setActiveNav("Goals")}>
          View all goals
        </button>
      </div>

      <div className="profileCard">
        <UserAvatar viewer={viewer} className="profileCardAvatar" />
        <div>
          <strong>{viewer.name}</strong>
          <span>{viewer.plan}</span>
        </div>
        <MoreHorizontal size={18} />
      </div>
    </aside>
  );
}

function ProfileMenu({
  theme,
  onToggleTheme,
  onSetTheme,
  viewer = buildViewer(null, null),
  onSignOut = () => {},
  onSaveProfile,
  onSaveAvatar,
  onRemoveAvatar,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("account");
  const [displayName, setDisplayName] = useState(viewer.name);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [workspaceName, setWorkspaceName] = usePersistentState("mark.workspaceName.v1", "My Mark workspace");
  const [profileStatus, setProfileStatus] = useState("");
  const [profilePrefs, setProfilePrefs] = usePersistentState("mark.profilePrefs.v1", {
    dailyReview: true,
    smartReminders: true,
    privateAnalytics: true,
    weeklyEmail: false,
    commandCenter: true,
  });
  const [workingMode, setWorkingMode] = usePersistentState("mark.workingMode.v1", "Balanced");
  const menuRef = useRef(null);
  const avatarInputRef = useRef(null);
  const isDark = theme === "dark";
  const profileItems = [
    { id: "account", label: "Account", detail: "Profile and workspace", icon: UserRound },
    { id: "settings", label: "Settings", detail: "Reminders and rhythm", icon: Settings2 },
    { id: "plan", label: "Your plan", detail: `${viewer.plan} active`, icon: CreditCard },
    { id: "privacy", label: "Privacy", detail: "Security and data controls", icon: ShieldCheck },
    { id: "shortcuts", label: "Shortcuts", detail: "Keyboard command center", icon: Keyboard },
  ];
  const shortcuts = [
    ["Open search", "Ctrl K"],
    ["Add task", "A"],
    ["Start focus", "F"],
    ["Jump calendar", "G C"],
  ];

  useEffect(() => {
    setDisplayName(viewer.name);
  }, [viewer.name]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnPointerDown = (event) => {
      if (menuRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const openPanel = (panel) => {
    setActivePanel(panel);
    setProfileStatus("");
  };

  const setPreference = (key, value) => {
    setProfilePrefs((current) => ({ ...current, [key]: value }));
    setProfileStatus("Preference updated.");
  };

  const saveAccount = async () => {
    const nextName = displayName.trim() || viewer.name;
    setProfileStatus("Saving account...");
    const result = await onSaveProfile?.({ displayName: nextName, workspaceName });
    setProfileStatus(result?.error ? result.error : "Account updated.");
  };

  const handleAvatarFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    const fileError = validateAvatarFile(file);
    if (fileError) {
      setProfileStatus(fileError);
      return;
    }

    setIsAvatarUploading(true);
    setProfileStatus("Uploading profile photo...");
    const result = await onSaveAvatar?.(file);
    setIsAvatarUploading(false);
    setProfileStatus(result?.error ? result.error : "Profile photo updated.");
  };

  const removeAvatar = async () => {
    setIsAvatarUploading(true);
    setProfileStatus("Removing profile photo...");
    const result = await onRemoveAvatar?.();
    setIsAvatarUploading(false);
    setProfileStatus(result?.error ? result.error : "Profile photo removed.");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(viewer.email);
      setProfileStatus("Email copied.");
    } catch {
      setProfileStatus("Could not copy email in this browser.");
    }
  };

  const setThemeChoice = (nextTheme) => {
    onSetTheme?.(nextTheme);
    setProfileStatus(`${nextTheme === "dark" ? "Dark" : "Light"} mode applied.`);
  };

  const setMode = (mode) => {
    setWorkingMode(mode);
    setProfileStatus(`${mode} mode selected.`);
  };

  const quickAction = (message) => {
    setProfileStatus(message);
  };

  const renderPanel = () => {
    if (activePanel === "account") {
      return (
        <div className="profileActionPanel" aria-label="Account settings">
          <div className="profilePanelTitle">
            <strong>Account</strong>
            <small>Keep the identity on your workspace clear.</small>
          </div>
          <div className="profileAvatarEditor">
            <UserAvatar viewer={viewer} className="profileAvatarEditorImage" />
            <div>
              <strong>Profile photo</strong>
              <small>JPG, PNG, WEBP, or GIF. Max 5MB.</small>
              <div className="profileAvatarActions">
                <button type="button" onClick={() => avatarInputRef.current?.click()} disabled={isAvatarUploading}>
                  <UserRound size={15} />
                  {isAvatarUploading ? "Uploading..." : "Change photo"}
                </button>
                <button type="button" onClick={removeAvatar} disabled={isAvatarUploading || !viewer.avatarPath}>
                  <Trash2 size={15} />
                  Remove
                </button>
              </div>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleAvatarFile} />
          </div>
          <label className="profileField">
            Display name
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </label>
          <label className="profileField">
            Workspace name
            <input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} />
          </label>
          <div className="profileInfoLine">
            <Mail size={14} />
            <span>{viewer.email}</span>
          </div>
          <div className="profilePanelActions">
            <button type="button" onClick={saveAccount}>
              <Check size={15} />
              Save
            </button>
            <button type="button" onClick={copyEmail}>
              <Mail size={15} />
              Copy email
            </button>
          </div>
        </div>
      );
    }

    if (activePanel === "settings") {
      return (
        <div className="profileActionPanel" aria-label="Workspace settings">
          <div className="profilePanelTitle">
            <strong>Settings</strong>
            <small>Shape how Mark nudges your workday.</small>
          </div>
          <div className="profileModeGrid" aria-label="Working mode">
            {["Calm", "Balanced", "Intense"].map((mode) => (
              <button key={mode} className={workingMode === mode ? "active" : ""} type="button" onClick={() => setMode(mode)}>
                {mode}
              </button>
            ))}
          </div>
          <ProfileSwitch
            label="Smart reminders"
            detail="Surface reminders around scheduled work."
            checked={profilePrefs.smartReminders}
            onChange={() => setPreference("smartReminders", !profilePrefs.smartReminders)}
          />
          <ProfileSwitch
            label="Daily review"
            detail="Show a closeout prompt near the end of the day."
            checked={profilePrefs.dailyReview}
            onChange={() => setPreference("dailyReview", !profilePrefs.dailyReview)}
          />
          <button className="profileWideAction" type="button" onClick={() => quickAction("Reminder test sent to your notification center.")}>
            <Bell size={15} />
            Test reminder
          </button>
        </div>
      );
    }

    if (activePanel === "plan") {
      return (
        <div className="profileActionPanel" aria-label="Plan details">
          <div className="profilePanelTitle">
            <strong>Your plan</strong>
            <small>{viewer.plan} is active. Billing can connect later.</small>
          </div>
          <div className="profilePlanMeter">
            <div>
              <span>Workspace usage</span>
              <strong>36%</strong>
            </div>
            <ProgressBar value={36} color="blue" />
          </div>
          <div className="profilePlanGrid">
            <span>Unlimited tasks</span>
            <span>Calendar sync ready</span>
            <span>Stripe plans later</span>
          </div>
          <div className="profilePanelActions">
            <button type="button" onClick={() => quickAction("Plan comparison opened.")}>
              <CreditCard size={15} />
              Compare
            </button>
            <button type="button" onClick={() => quickAction("Billing will be available when Stripe is connected.")}>
              <Settings2 size={15} />
              Billing
            </button>
          </div>
        </div>
      );
    }

    if (activePanel === "privacy") {
      return (
        <div className="profileActionPanel" aria-label="Privacy controls">
          <div className="profilePanelTitle">
            <strong>Privacy</strong>
            <small>Control what Mark can use for personalization.</small>
          </div>
          <ProfileSwitch
            label="Private analytics"
            detail="Only use your activity for your own insights."
            checked={profilePrefs.privateAnalytics}
            onChange={() => setPreference("privateAnalytics", !profilePrefs.privateAnalytics)}
          />
          <ProfileSwitch
            label="Weekly email"
            detail="Send a weekly summary to your account email."
            checked={profilePrefs.weeklyEmail}
            onChange={() => setPreference("weeklyEmail", !profilePrefs.weeklyEmail)}
          />
          <div className="profilePanelActions">
            <button type="button" onClick={() => quickAction("Data export prepared for this workspace.")}>
              <ShieldCheck size={15} />
              Export data
            </button>
            <button type="button" onClick={() => quickAction("Security check complete.")}>
              <CheckCircle2 size={15} />
              Security check
            </button>
          </div>
        </div>
      );
    }

    if (activePanel === "shortcuts") {
      return (
        <div className="profileActionPanel" aria-label="Keyboard shortcuts">
          <div className="profilePanelTitle">
            <strong>Shortcuts</strong>
            <small>Fast paths for moving around Mark.</small>
          </div>
          <ProfileSwitch
            label="Command center"
            detail="Keep shortcut hints available in the app."
            checked={profilePrefs.commandCenter}
            onChange={() => setPreference("commandCenter", !profilePrefs.commandCenter)}
          />
          <div className="profileShortcutList">
            {shortcuts.map(([label, keys]) => (
              <div key={label}>
                <span>{label}</span>
                <kbd>{keys}</kbd>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="profileActionPanel" aria-label="Appearance settings">
        <div className="profilePanelTitle">
          <strong>Appearance</strong>
          <small>Choose the visual mode for your workspace.</small>
        </div>
        <div className="profileThemeGrid">
          <button className={!isDark ? "active" : ""} type="button" onClick={() => setThemeChoice("light")}>
            <Sun size={16} />
            Light
          </button>
          <button className={isDark ? "active" : ""} type="button" onClick={() => setThemeChoice("dark")}>
            <Moon size={16} />
            Dark
          </button>
        </div>
        <p className="profileFinePrint">Dark mode keeps the same Mark layout with calmer contrast for long work sessions.</p>
      </div>
    );
  };

  return (
    <div className="topbarActionSlot profileMenuSlot" ref={menuRef}>
      <button
        className="profileButton"
        type="button"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title="Open profile menu"
        onClick={() => setIsOpen((current) => !current)}
      >
        <UserAvatar viewer={viewer} className="profileAvatarButton" />
      </button>

      {isOpen ? (
        <div className="topbarPopover profilePopover" role="dialog" aria-label="Profile menu">
          <div className="profilePopoverHeader">
            <UserAvatar viewer={viewer} large />
            <div>
              <strong>{viewer.name}</strong>
              <small>{viewer.email}</small>
            </div>
            <em>{viewer.plan.replace(" Plan", "")}</em>
          </div>

          <div className="profileMenuList">
            {profileItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <button key={item.label} className={activePanel === item.id ? "active" : ""} type="button" onClick={() => openPanel(item.id)}>
                  <ItemIcon size={16} />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </span>
                </button>
              );
            })}
          </div>

          {renderPanel()}

          {profileStatus ? (
            <p className="profileStatusLine" role="status">
              <CheckCircle2 size={14} />
              {profileStatus}
            </p>
          ) : null}

          <button
            className="profileThemeToggle"
            type="button"
            aria-pressed={isDark}
            onClick={() => {
              onToggleTheme();
              setProfileStatus(isDark ? "Light mode applied." : "Dark mode applied.");
            }}
          >
            <span>
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
              <strong>Appearance</strong>
            </span>
            <small>{isDark ? "Dark mode" : "Light mode"}</small>
          </button>

          <div className="profileMenuFooter">
            <button type="button" onClick={() => openPanel("appearance")}>
              <Palette size={15} />
              Theme
            </button>
            <button type="button" onClick={onSignOut}>
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProfileSwitch({ label, detail, checked, onChange }) {
  return (
    <button className="profileSwitch" type="button" role="switch" aria-checked={checked} onClick={onChange}>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <i aria-hidden="true" />
    </button>
  );
}

function Header({
  activeNav,
  setActiveNav,
  tasks,
  goals,
  reminders,
  onAddTask,
  theme,
  onToggleTheme,
  onSetTheme,
  viewer,
  onSignOut,
  onSaveProfile,
  onSaveAvatar,
  onRemoveAvatar,
}) {
  const [headerDate, setHeaderDate] = useState(() => getToday());
  const [openPopover, setOpenPopover] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const headerWeekStart = startOfWeek(headerDate);
  const headerWeekRange = formatWeekRange(headerWeekStart);
  const query = searchQuery.trim().toLowerCase();
  const subtitles = {
    Overview: "Here is your progress and plan for today.",
    Calendar: "Protect the time blocks that matter most.",
    Tasks: "Turn the day into a clear, scheduled queue.",
    Goals: "Keep long-term outcomes tied to today.",
    Focus: "Run focused sessions and close the loop.",
    Habits: "Track the repeated actions behind the score.",
    Analytics: "Here is the signal behind your best work.",
    "Check-ins": "Capture work logs, streaks, and weekly notes.",
  };
  const searchItems = [
    ...navItems.map((item) => ({ label: item.label, detail: "Open section", nav: item.label, type: "Section" })),
    ...tasks.map((task) => ({ label: task.title, detail: `${task.start} - ${task.end} - ${task.project}`, nav: "Tasks", type: "Task" })),
    ...goals.map((goal) => ({ label: goal.label, detail: `${goal.progress}% complete`, nav: "Goals", type: "Goal" })),
  ];
  const searchResults = query
    ? searchItems.filter((item) => `${item.label} ${item.detail} ${item.type}`.toLowerCase().includes(query)).slice(0, 6)
    : searchItems.filter((item) => item.type === "Section").slice(0, 4);
  const notifications = [
    ...reminders.filter((reminder) => reminder.enabled).map((reminder) => ({
      title: reminder.title,
      detail: reminder.detail,
    })),
    ...tasks.filter((task) => task.reminder && !task.completed).map((task) => ({
      title: task.title,
      detail: `${task.start} - ${task.project}`,
    })),
  ].slice(0, 6);

  const togglePopover = (panel) => {
    setOpenPopover((current) => (current === panel ? null : panel));
  };

  useEffect(() => {
    if (!openPopover) return undefined;

    const closeOnPointerDown = (event) => {
      if (event.target.closest(".topbarActionSlot:not(.profileMenuSlot)")) return;
      setOpenPopover(null);
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpenPopover(null);
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openPopover]);

  const openResult = (nav) => {
    setActiveNav(nav);
    setOpenPopover(null);
    setSearchQuery("");
  };

  return (
    <header className="topbar">
      <div>
        <h1>Good afternoon, {viewer.name}.</h1>
        <p>{subtitles[activeNav]}</p>
      </div>
      <div className="topbarActions">
        <button className="dateButton" type="button" onClick={() => setHeaderDate(getToday())}>
          {headerWeekRange}
          <ChevronDown size={16} />
        </button>
        <div className="stepper" aria-label="Change week">
          <IconButton label="Previous week" onClick={() => setHeaderDate((current) => addDays(current, -7))}>
            <ChevronLeft size={18} />
          </IconButton>
          <IconButton label="Next week" onClick={() => setHeaderDate((current) => addDays(current, 7))}>
            <ChevronRight size={18} />
          </IconButton>
        </div>
        <span className="divider" />
        <div className="topbarActionSlot">
          <IconButton label="Search" onClick={() => togglePopover("search")} aria-expanded={openPopover === "search"}>
            <Search size={18} />
          </IconButton>
          {openPopover === "search" ? (
            <div className="topbarPopover searchPopover" role="dialog" aria-label="Search Mark">
              <label className="searchField">
                <Search size={16} />
                <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search tasks, goals, sections" autoFocus />
              </label>
              <div className="popoverList">
                {searchResults.length ? (
                  searchResults.map((item) => (
                    <button key={`${item.type}-${item.label}`} type="button" onClick={() => openResult(item.nav)}>
                      <span>{item.type}</span>
                      <strong>{item.label}</strong>
                      <small>{item.detail}</small>
                    </button>
                  ))
                ) : (
                  <p className="popoverEmpty">No results found.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
        <div className="topbarActionSlot">
          <IconButton
            label="Notifications"
            className={`notification ${notifications.length ? "" : "isEmpty"}`}
            onClick={() => togglePopover("notifications")}
            aria-expanded={openPopover === "notifications"}
          >
            <Bell size={18} />
          </IconButton>
          {openPopover === "notifications" ? (
            <div className="topbarPopover notificationPopover" role="dialog" aria-label="Notifications">
              <div className="popoverHeader">
                <strong>Notifications</strong>
                <span>{notifications.length}</span>
              </div>
              <div className="notificationList">
                {notifications.length ? (
                  notifications.map((notificationItem) => (
                    <article key={`${notificationItem.title}-${notificationItem.detail}`}>
                      <Bell size={15} />
                      <div>
                        <strong>{notificationItem.title}</strong>
                        <small>{notificationItem.detail}</small>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="popoverEmpty">You have no notifications.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
        <button className="primaryButton" type="button" onClick={onAddTask}>
          <Plus size={18} />
          Add / Schedule
        </button>
        <ProfileMenu
          theme={theme}
          onToggleTheme={onToggleTheme}
          onSetTheme={onSetTheme}
          viewer={viewer}
          onSignOut={onSignOut}
          onSaveProfile={onSaveProfile}
          onSaveAvatar={onSaveAvatar}
          onRemoveAvatar={onRemoveAvatar}
        />
      </div>
    </header>
  );
}

function AnalyticsStrip({ stats }) {
  return (
    <section className="analyticsStrip" aria-label="Weekly productivity insights">
      <MetricCard title="Productivity Score" value={stats.score} suffix="/100" delta={stats.scoreDelta.text} deltaTone={stats.scoreDelta.tone}>
        <Sparkline values={stats.scoreTrend} />
      </MetricCard>
      <MetricCard title="Focus Hours" value={stats.focusHours} suffix=" hrs" delta={stats.focusDelta.text} deltaTone={stats.focusDelta.tone}>
        <Sparkline values={stats.focusTrend} />
      </MetricCard>
      <MetricCard title="Task Completion" value={stats.completion} suffix="%" delta={stats.completionDelta.text} deltaTone={stats.completionDelta.tone}>
        <Sparkline values={stats.completionTrend} color="green" />
      </MetricCard>
      <MetricCard title="Best Focus Window" value={stats.bestFocusWindow.label} delta={stats.bestFocusWindow.detail} deltaTone={stats.bestFocusWindow.hasData ? "positive" : "neutral"}>
        <MiniBars values={stats.bestFocusWindow.bars} color="slate" />
      </MetricCard>
      <section className="weeklyInsight">
        <span>
          <Sparkles size={18} />
        </span>
        <div>
          <small>{stats.weeklyInsight.kicker}</small>
          <h2>{stats.weeklyInsight.title}</h2>
          <p>{stats.weeklyInsight.body}</p>
        </div>
      </section>
    </section>
  );
}

function GoalsProgress({ goals }) {
  return (
    <section className="goalsProgress" aria-label="Goals progress">
      <div className="panelHeader compact">
        <h2>Goals Progress</h2>
        <button className="plainLink" type="button">Manage goals</button>
      </div>
      <div className="goalsGrid">
        {goals.map((goal) => {
          const GoalIcon = getGoalIcon(goal);
          return (
            <article key={goal.id} className="goalItem">
              <span className={`goalIcon ${goal.color}`}>
                <GoalIcon size={17} />
              </span>
              <div>
                <div className="goalLabel">
                  <strong>{goal.label}</strong>
                  <span>{goal.progress}%</span>
                </div>
                <ProgressBar value={goal.progress} color={goal.color} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProductLoopPanel({ tasks, goals, habits, checkIns, stats }) {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const topGoal = [...goals].sort((a, b) => b.progress - a.progress)[0];
  const activeHabit = habits.find((habit) => habit.checks.some((checked) => !checked)) ?? habits[0];
  const latestCheckIn = checkIns[0];
  const loopItems = [
    {
      label: "Tasks",
      value: `${completedTasks}/${tasks.length}`,
      detail: "completion feeds goal progress",
      icon: ListChecks,
      color: "blue",
    },
    {
      label: "Goals",
      value: `${stats.goalAverage}%`,
      detail: topGoal ? `${topGoal.label} is leading` : "No active goal",
      icon: Target,
      color: "green",
    },
    {
      label: "Habits",
      value: `${stats.habitCompletion}%`,
      detail: activeHabit ? `${activeHabit.name} supports the loop` : "No habits yet",
      icon: LayoutList,
      color: "violet",
    },
    {
      label: "Check-ins",
      value: stats.checkInCount,
      detail: latestCheckIn?.value ?? "No reflections yet",
      icon: CheckCircle2,
      color: "orange",
    },
  ];

  return (
    <section className="productLoopPanel" aria-label="Connected productivity loop">
      <div className="panelHeader compact">
        <h2>Today&apos;s loop</h2>
        <span>Tasks to goals to habits to check-ins</span>
      </div>
      <div className="productLoopGrid">
        {loopItems.map((item) => {
          const ItemIcon = item.icon;
          return (
            <article key={item.label}>
              <span className={`goalIcon ${item.color}`}>
                <ItemIcon size={16} />
              </span>
              <div>
                <small>{item.label}</small>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TaskColumn({ tasks, inbox, selectedTaskId, onSelectTask, onToggleComplete, onAddTask }) {
  const scheduled = tasks;

  return (
    <section className="taskColumn" aria-label="Task list">
      <div className="panelHeader">
        <div>
          <span className="eyebrow">Scheduled</span>
          <h2>{scheduled.length} tasks</h2>
        </div>
        <button className="quietButton" type="button" onClick={onAddTask}>
          <Plus size={16} />
          Task
        </button>
      </div>

      <div className="taskRows">
        {scheduled.map((task) => (
          <button
            key={task.id}
            className={`taskRow ${selectedTaskId === task.id ? "selected" : ""}`}
            type="button"
            onClick={() => onSelectTask(task.id)}
          >
            <span
              className={`taskCheck ${task.completed ? "done" : ""}`}
              onClick={(event) => {
                event.stopPropagation();
                onToggleComplete(task.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggleComplete(task.id);
                }
              }}
              role="checkbox"
              aria-checked={task.completed}
              tabIndex={0}
            >
              {task.completed ? <Check size={13} /> : null}
            </span>
            <span>
              <strong>{task.title}</strong>
              <small>
                {task.start} - {task.end}
              </small>
            </span>
          </button>
        ))}
      </div>

      <div className="unscheduled">
        <div className="sectionHeading small">
          <span>Unscheduled</span>
          <b>{inbox.length}</b>
        </div>
        <ul>
          {inbox.length ? (
            inbox.slice(0, 4).map((item) => (
              <li key={item}>
                <Circle size={15} />
                <span>{item}</span>
              </li>
            ))
          ) : (
            <li className="emptyLine">Everything has a slot.</li>
          )}
        </ul>
      </div>
    </section>
  );
}

function Timeline({ tasks, selectedTaskId, onSelectTask }) {
  const timelineDate = tasks[0] ? getTaskDate(tasks[0]) : getToday();
  const scheduledMinutes = tasks.reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0);
  const taskLabel = tasks.length === 1 ? "task" : "tasks";
  const scheduleSummary = tasks.length ? `${tasks.length} ${taskLabel} - ${formatDuration(scheduledMinutes)} scheduled` : "No scheduled blocks yet";

  return (
    <section className="timelinePanel" aria-label="Day calendar">
      <div className="timelineHeader">
        <div className="timelineTitle">
          <h2>{fullDateFormatter.format(timelineDate)}</h2>
          <p>{scheduleSummary}</p>
        </div>
        <div className="dayControls">
          <button type="button">Today</button>
          <span className="stepper">
            <IconButton label="Previous day">
              <ChevronLeft size={17} />
            </IconButton>
            <IconButton label="Next day">
              <ChevronRight size={17} />
            </IconButton>
          </span>
        </div>
        <div className="viewSwitch" role="tablist" aria-label="Calendar view">
          <button className="active" type="button">Day</button>
          <button type="button">Week</button>
          <button type="button">Month</button>
        </div>
      </div>

      <div className="timelineGrid">
        <div className="timeLabels">
          {hours.map((hour) => (
            <span key={hour}>{hour}</span>
          ))}
        </div>
        <div className="calendarCanvas">
          {hours.map((hour) => (
            <span className="gridLine" key={hour} />
          ))}
          <div className="nowLine" style={{ top: `${((9 * 60 + 41 - 7 * 60) / (12 * 60)) * 100}%` }}>
            <span>9:41 AM</span>
          </div>
          {tasks.map((task) => {
            const startOffset = timeToMinutes(task.start) - 7 * 60;
            const top = (startOffset / (12 * 60)) * 100;
            const height = (minutesBetween(task.start, task.end) / (12 * 60)) * 100;
            return (
              <button
                key={task.id}
                className={`calendarBlock ${task.color} ${selectedTaskId === task.id ? "selected" : ""}`}
                style={{ top: `${top}%`, height: `${height}%` }}
                type="button"
                onClick={() => onSelectTask(task.id)}
              >
                <strong>{task.title}</strong>
                <span>
                  {task.start} - {task.end}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TaskDetails({ task, onClose, onToggleComplete, onDelete }) {
  if (!task) {
    return (
      <section className="taskDetails emptyState" aria-label="Selected task">
        <Clock3 size={22} />
        <h2>Select a task</h2>
        <p>Pick a block to review notes, reminders, and check-in actions.</p>
      </section>
    );
  }

  return (
    <section className="taskDetails" aria-label="Selected task details">
      <div className="detailTop">
        <span className={`statusDot ${task.color}`} />
        <h2>{task.title}</h2>
        <IconButton label="Close task details" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </div>
      <dl>
        <div>
          <dt>
            <Clock3 size={16} />
            Time
          </dt>
          <dd>
            {formatTaskDate(task)} - {task.start} - {task.end} ({formatDuration(minutesBetween(task.start, task.end))})
          </dd>
        </div>
        <div>
          <dt>
            <Target size={16} />
            Project
          </dt>
          <dd>{task.project}</dd>
        </div>
        <div>
          <dt>
            <AlarmClock size={16} />
            Reminder
          </dt>
          <dd>{task.reminder ? "15 min before" : "Off"}</dd>
        </div>
        {task.linkedGoal ? (
          <div>
            <dt>
              <Goal size={16} />
              Linked goal
            </dt>
            <dd>{task.linkedGoal}</dd>
          </div>
        ) : null}
        {task.linkedHabit ? (
          <div>
            <dt>
              <LayoutList size={16} />
              Linked habit
            </dt>
            <dd>{task.linkedHabit}</dd>
          </div>
        ) : null}
      </dl>
      <div className="tagRow">
        <span>{task.category}</span>
        <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>
      <div className="notes">
        <h3>Notes</h3>
        <p>{task.notes}</p>
      </div>
      <div className="detailActions">
        <button className="secondaryButton" type="button" onClick={() => onToggleComplete(task.id)}>
          <CheckCircle2 size={17} />
          {task.completed ? "Completed" : "Mark as Complete"}
        </button>
        <IconButton label="Delete task" onClick={() => onDelete(task.id)}>
          <Trash2 size={17} />
        </IconButton>
      </div>
    </section>
  );
}

function PlannerBoard({ tasks, inbox, selectedTaskId, setSelectedTaskId, setTasks, onAddTask }) {
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? (selectedTaskId === null ? null : tasks[0]);

  const toggleComplete = (id) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id) => {
    const nextTask = tasks.find((task) => task.id !== id);
    setTasks((current) => current.filter((task) => task.id !== id));
    setSelectedTaskId(nextTask?.id ?? null);
  };

  return (
    <section className={`plannerBoard ${selectedTask ? "hasTaskDetails" : "plannerBoardEmpty"}`} aria-label="Planner workspace">
      <TaskColumn
        tasks={tasks}
        inbox={inbox}
        selectedTaskId={selectedTask?.id}
        onSelectTask={setSelectedTaskId}
        onToggleComplete={toggleComplete}
        onAddTask={onAddTask}
      />
      <Timeline tasks={tasks} selectedTaskId={selectedTask?.id} onSelectTask={setSelectedTaskId} />
      <TaskDetails
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onToggleComplete={toggleComplete}
        onDelete={deleteTask}
      />
    </section>
  );
}

function FocusRail({ reminders, setReminders, checkIns, focusTimer, onToggleFocusTimer, onResetFocusTimer, onEndFocusSession }) {
  const timerMeta = getFocusTimerMeta(focusTimer);
  const isRunning = Boolean(focusTimer?.running);

  return (
    <aside className="rightRail">
      <section className="railPanel focusPanel">
        <div className="panelHeader compact">
          <span>Focus</span>
          <MoreHorizontal size={17} />
        </div>
        <strong className="timer">{timerMeta.display}</strong>
        <p>{isRunning ? `Running to ${timerMeta.targetDisplay}` : timerMeta.isComplete ? "Session complete" : "Ready for focus"}</p>
        <div className="focusControls">
          <button className="timerButton" type="button" onClick={onToggleFocusTimer} disabled={timerMeta.isComplete} aria-label={isRunning ? "Pause focus timer" : "Start focus timer"}>
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="stopButton" type="button" onClick={onResetFocusTimer} aria-label="Reset focus timer">
            <Square size={17} />
          </button>
        </div>
        <div className="focusProgress">
          <span>{timerMeta.isComplete ? "Session finished. Save it as a check-in." : `${timerMeta.progress}% complete - ${formatDuration(timerMeta.remainingMinutes)} remaining`}</span>
          <ProgressBar value={timerMeta.progress} color="blue" />
        </div>
        <button className="secondaryButton full" type="button" onClick={onEndFocusSession} disabled={!timerMeta.elapsedSeconds}>
          <CheckCircle2 size={17} />
          End Session & Check-in
        </button>
      </section>

      <section className="railPanel">
        <div className="panelHeader compact">
          <span>Reminders</span>
          <MoreHorizontal size={17} />
        </div>
        <div className="reminderList">
          {reminders.map((reminder) => (
            <label key={reminder.id} className="reminderRow">
              <Bell size={16} />
              <span>
                <strong>{reminder.title}</strong>
                <small>{reminder.detail}</small>
              </span>
              <input
                type="checkbox"
                checked={reminder.enabled}
                onChange={() =>
                  setReminders((current) =>
                    current.map((item) => (item.id === reminder.id ? { ...item, enabled: !item.enabled } : item)),
                  )
                }
              />
            </label>
          ))}
        </div>
        <button className="linkButton" type="button">
          <Plus size={15} />
          Add reminder
        </button>
      </section>

      <section className="railPanel">
        <div className="panelHeader compact">
          <span>Streak</span>
          <MoreHorizontal size={17} />
        </div>
        <div className="streakBlock">
          <Flame size={25} />
          <strong>12 <span>days</span></strong>
          <p>Current streak</p>
        </div>
        <div className="weekDots" aria-label="Current week habit streak">
          {days.map((day, index) => (
            <span key={`${day}-${index}`} className={index < 6 ? "done" : ""}>
              {index < 6 ? <Check size={12} /> : day}
            </span>
          ))}
        </div>
      </section>

      <section className="railPanel">
        <div className="panelHeader compact">
          <span>Recent Check-ins</span>
          <MoreHorizontal size={17} />
        </div>
        <div className="checkInList">
          {checkIns.length ? (
            checkIns.slice(0, 3).map((checkIn) => (
              <div className="checkInRow" key={checkIn.id}>
                <CheckCircle2 size={17} />
                <span>
                  <strong>{checkIn.when}</strong>
                  <small>{checkIn.value}</small>
                </span>
              </div>
            ))
          ) : (
            <div className="emptyLine">No check-ins yet.</div>
          )}
        </div>
        <button className="plainLink" type="button">
          View all check-ins
        </button>
      </section>
    </aside>
  );
}

function WeeklyGlance({ stats }) {
  const donutBackground = getDonutBackground(stats.distribution);

  return (
    <section className="weeklyGlance" aria-label="This week at a glance">
      <div className="weeklyMetric lead">
        <h2>This Week at a Glance</h2>
        <p>Focus Hours</p>
        <strong>{stats.focusHours} hrs</strong>
        <MiniBars values={stats.focusTrend} />
      </div>
      <div className="weeklyMetric">
        <p>Task Completion</p>
        <strong>{stats.completion}%</strong>
        <MiniBars values={stats.completionTrend} color="green" />
      </div>
      <div className="weeklyMetric">
        <p>Meetings</p>
        <strong>{(stats.meetingMinutes / 60).toFixed(1)} hrs</strong>
        <MiniBars values={stats.meetingTrend} color="slate" />
      </div>
      <div className="donutPanel">
        <div className="donut" style={{ background: donutBackground }} aria-hidden="true" />
        <ul>
          {stats.distribution.items.map((item) => (
            <li key={item.key}>
              <span className={`legend ${item.className}`} />
              {item.label}
              <b>{item.value}%</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ViewStat({ icon: Icon, label, value, detail, color = "blue" }) {
  return (
    <article className="viewStat">
      <span className={`goalIcon ${color}`}>
        <Icon size={17} />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function CalendarWeekStrip({ tasks }) {
  const dailyLoads = [72, 88, 64, 78, 58, 34, 24];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = ["22", "23", "24", "25", "26", "27", "28"];

  return (
    <section className="calendarWeekStrip" aria-label="Week workload">
      {dayNames.map((day, index) => (
        <button key={day} className={index === 0 ? "active" : ""} type="button">
          <span>
            <b>{day}</b>
            <small>{dates[index]}</small>
          </span>
          <i style={{ height: `${dailyLoads[index]}%` }} />
          <em>{index === 0 ? `${tasks.length} blocks` : `${Math.max(2, Math.round(dailyLoads[index] / 18))} blocks`}</em>
        </button>
      ))}
    </section>
  );
}

function CalendarToolbar({
  calendarMode,
  selectedDate,
  weekStart,
  scheduledMinutes,
  focusBlocks,
  activeReminders,
  selectedTask,
  onToday,
  onMoveRange,
  onSetMode,
  onAddTask,
  theme,
  onToggleTheme,
  onSetTheme,
  viewer,
  onSignOut,
  onSaveProfile,
  onSaveAvatar,
  onRemoveAvatar,
}) {
  const calendarTitle = calendarMode === "Day" ? fullDateFormatter.format(selectedDate) : monthYearFormatter.format(selectedDate);
  const calendarSubtitle = calendarMode === "Day" ? "Daily schedule" : `Week of ${formatWeekRange(weekStart)}`;
  const viewModes = ["Day", "Week", "Month", "Schedule"];

  return (
    <section className="calendarToolbar" aria-label="Calendar controls">
      <div className="calendarToolbarMain">
        <div className="calendarTitleBlock">
          <span className="calendarToolbarIcon">
            <CalendarDays size={20} />
          </span>
          <div>
            <h1>{calendarTitle}</h1>
            <p>{calendarSubtitle}</p>
          </div>
        </div>
        <div className="calendarToolbarActions">
          <button className="quietButton" type="button" onClick={onToday}>Today</button>
          <span className="stepper" aria-label="Change calendar range">
            <IconButton label="Previous range" onClick={() => onMoveRange(-1)}>
              <ChevronLeft size={18} />
            </IconButton>
            <IconButton label="Next range" onClick={() => onMoveRange(1)}>
              <ChevronRight size={18} />
            </IconButton>
          </span>
          <div className="viewSwitch calendarViewSwitch" role="tablist" aria-label="Calendar view">
            {viewModes.map((mode) => (
              <button key={mode} className={calendarMode === mode ? "active" : ""} type="button" onClick={() => onSetMode(mode)}>
                {mode}
              </button>
            ))}
          </div>
          <button className="primaryButton" type="button" onClick={onAddTask}>
            <Plus size={17} />
            Create
          </button>
          <ProfileMenu
            theme={theme}
            onToggleTheme={onToggleTheme}
            onSetTheme={onSetTheme}
            viewer={viewer}
            onSignOut={onSignOut}
            onSaveProfile={onSaveProfile}
            onSaveAvatar={onSaveAvatar}
            onRemoveAvatar={onRemoveAvatar}
          />
        </div>
      </div>

      <div className="calendarOptions">
        <button className="active" type="button">
          <CheckCircle2 size={15} />
          Tasks
        </button>
        <button className="active" type="button">
          <Focus size={15} />
          Focus blocks
        </button>
        <button type="button">
          <Bell size={15} />
          Reminders
        </button>
        <button type="button">
          <Target size={15} />
          Goals
        </button>
        <span>{formatDuration(scheduledMinutes)} scheduled</span>
        <span>{focusBlocks} focus blocks</span>
        <span>{activeReminders} reminders</span>
        {selectedTask ? <strong>{selectedTask.title}</strong> : null}
      </div>
    </section>
  );
}

function CalendarBoard({
  tasks,
  calendarDays,
  calendarMode,
  selectedDate,
  selectedTaskId,
  onSelectDate,
  onSelectTask,
  onToggleTask,
  onDeleteTask,
  onMoveTask,
}) {
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? tasks[0];
  const viewStart = 7 * 60;
  const viewMinutes = 12 * 60;
  const viewEnd = viewStart + viewMinutes;
  const visibleDays = calendarMode === "Day" ? calendarDays.filter((day) => isSameDate(day.date, selectedDate)) : calendarDays;
  const boardMinWidth = visibleDays.length === 1 ? "520px" : "1044px";
  const dayColumns = `64px repeat(${visibleDays.length}, minmax(140px, 1fr))`;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const showNowLine = visibleDays.some((day) => day.isToday) && nowMinutes >= viewStart && nowMinutes <= viewStart + viewMinutes;
  const [dragState, setDragState] = useState(null);
  const [dropPreview, setDropPreview] = useState(null);
  const draggingTaskId = dragState?.taskId ?? null;
  const isDraggingTask = Boolean(dragState?.active);
  const taskEvents = tasks.map((task, index) => ({ ...task, dateKey: task.dateKey ?? calendarDays[index % calendarDays.length].key }));

  const getDropPreviewForPoint = (clientX, clientY, duration = 60) => {
    const element = document.elementFromPoint(clientX, clientY);
    const lane = element?.closest?.(".calendarDayLane");
    if (!lane) return null;
    const dateKey = lane.getAttribute("data-date-key");
    const day = visibleDays.find((visibleDay) => visibleDay.key === dateKey);
    if (!day) return null;
    const laneRect = lane.getBoundingClientRect();
    const offsetY = Math.max(0, Math.min(laneRect.height, clientY - laneRect.top));
    const rawMinutes = viewStart + (offsetY / laneRect.height) * viewMinutes;
    const latestStart = viewEnd - Math.max(15, duration);
    const startMinutes = Math.max(viewStart, Math.min(latestStart, snapToQuarterHour(rawMinutes)));
    return {
      date: day.date,
      dateKey: day.key,
      label: formatTimeFromMinutes(startMinutes),
      startMinutes,
      top: ((startMinutes - viewStart) / viewMinutes) * 100,
    };
  };

  const handleTaskMouseDown = (event, task) => {
    if (event.button !== 0) return;
    setDragState({
      active: false,
      originX: event.clientX,
      originY: event.clientY,
      taskId: task.id,
    });
    setDropPreview(null);
    onSelectTask(task.id);
  };

  const clearDragState = () => {
    setDragState(null);
    setDropPreview(null);
  };

  useEffect(() => {
    if (!dragState) return undefined;
    const draggedTask = tasks.find((task) => task.id === dragState.taskId);
    if (!draggedTask) {
      clearDragState();
      return undefined;
    }

    const handleMouseMove = (event) => {
      const movedDistance = Math.hypot(event.clientX - dragState.originX, event.clientY - dragState.originY);
      if (!dragState.active && movedDistance < 4) return;
      event.preventDefault();
      const nextPreview = getDropPreviewForPoint(event.clientX, event.clientY, minutesBetween(draggedTask.start, draggedTask.end));
      setDropPreview((current) =>
        current?.dateKey === nextPreview?.dateKey && current?.label === nextPreview?.label ? current : nextPreview,
      );
      setDragState((current) => (current && !current.active ? { ...current, active: true } : current));
    };

    const handleMouseUp = (event) => {
      const movedDistance = Math.hypot(event.clientX - dragState.originX, event.clientY - dragState.originY);
      const shouldMove = dragState.active || movedDistance >= 4;
      const finalPreview = shouldMove
        ? getDropPreviewForPoint(event.clientX, event.clientY, minutesBetween(draggedTask.start, draggedTask.end))
        : null;
      if (finalPreview) {
        onMoveTask(draggedTask.id, finalPreview.date, finalPreview.startMinutes);
      }
      clearDragState();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, tasks]);

  return (
    <section className={`calendarBoard ${isDraggingTask ? "dragging" : ""}`} aria-label="Week calendar">
      <div className="calendarBoardHeader" style={{ gridTemplateColumns: dayColumns, minWidth: boardMinWidth }}>
        <span className="calendarTimezone">GMT+1</span>
        {visibleDays.map((day) => (
          <button
            key={day.key}
            className={`${day.isToday ? "today" : ""} ${day.isSelected ? "selected" : ""}`.trim()}
            type="button"
            onClick={() => onSelectDate(day.date)}
          >
            <span>{day.short}</span>
            <strong>{day.dateNumber}</strong>
          </button>
        ))}
      </div>

      <div className="calendarAllDay" style={{ gridTemplateColumns: dayColumns, minWidth: boardMinWidth }}>
        <span>All day</span>
        {visibleDays.map((day) => (
          <div key={day.key}>
            {day.short === "Mon" ? <button type="button">Weekly planning review</button> : null}
            {day.short === "Fri" ? <button type="button">Product release notes</button> : null}
          </div>
        ))}
      </div>

      <div className="calendarTimeGrid" style={{ minWidth: boardMinWidth }}>
        <div className="calendarTimeLabels">
          {hours.map((hour) => (
            <span key={hour}>{hour}</span>
          ))}
        </div>
        <div className="calendarWeekCanvas" style={{ gridTemplateColumns: `repeat(${visibleDays.length}, minmax(140px, 1fr))` }}>
          {showNowLine ? <div className="calendarNowLine" style={{ top: `${((nowMinutes - viewStart) / viewMinutes) * 100}%` }} /> : null}
          {visibleDays.map((day) => (
            <div
              className={`${day.isToday ? "calendarDayLane today" : "calendarDayLane"} ${dropPreview?.dateKey === day.key ? "dragTarget" : ""}`.trim()}
              data-date-key={day.key}
              key={day.key}
            >
              {dropPreview?.dateKey === day.key ? (
                <div className="calendarDropGuide" style={{ top: `${dropPreview.top}%` }}>
                  <span>{dropPreview.label}</span>
                </div>
              ) : null}
              {taskEvents
                .filter((task) => task.dateKey === day.key)
                .map((task) => {
                  const startMinutes = timeToMinutes(task.start);
                  const endMinutes = timeToMinutes(task.end);
                  const visibleStart = Math.max(startMinutes, viewStart);
                  const visibleEnd = Math.min(endMinutes, viewEnd);
                  if (visibleEnd <= viewStart || visibleStart >= viewEnd) return null;
                  const top = ((visibleStart - viewStart) / viewMinutes) * 100;
                  const duration = minutesBetween(task.start, task.end);
                  const height = ((visibleEnd - visibleStart) / viewMinutes) * 100;
                  const compactClass = duration < 60 ? "compact" : "";
                  return (
                    <button
                      key={task.id}
                      aria-label={`${task.title}, ${task.start} to ${task.end}`}
                      className={`calendarEvent ${compactClass} ${task.color} ${selectedTaskId === task.id ? "selected" : ""} ${draggingTaskId === task.id && isDraggingTask ? "dragging" : ""}`}
                      data-task-id={task.id}
                      style={{ top: `${top}%`, height: `${height}%` }}
                      title={`${task.title} - ${task.start} to ${task.end}`}
                      type="button"
                      onClick={() => onSelectTask(task.id)}
                      onMouseDown={(event) => handleTaskMouseDown(event, task)}
                    >
                      <strong>{task.title}</strong>
                      <span>{task.start} - {task.end}</span>
                      <small>{task.project}</small>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {selectedTask ? (
        <div className="calendarSelectionBar" style={{ minWidth: boardMinWidth }}>
          <span className={`statusDot ${selectedTask.color}`} />
          <div>
            <strong>{selectedTask.title}</strong>
            <span>
              {formatTaskDate(selectedTask)} - {selectedTask.start} - {selectedTask.end} - {selectedTask.project}
            </span>
          </div>
          <button className="secondaryButton" type="button" onClick={() => onToggleTask(selectedTask.id)}>
            <CheckCircle2 size={16} />
            {selectedTask.completed ? "Completed" : "Mark complete"}
          </button>
          <IconButton label="Delete selected task" onClick={() => onDeleteTask(selectedTask.id)}>
            <Trash2 size={17} />
          </IconButton>
        </div>
      ) : null}
    </section>
  );
}

function TaskAgendaList({ tasks, selectedTaskId, onSelectTask, onToggleComplete, emptyLabel = "No tasks in this view." }) {
  if (!tasks.length) {
    return (
      <div className="emptyState taskListEmpty">
        <Clock3 size={21} />
        <h2>Clear lane</h2>
        <p>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="taskAgendaList">
      {tasks.map((task) => (
        <article
          key={task.id}
          className={`taskAgendaRow ${task.completed ? "completed" : ""} ${selectedTaskId === task.id ? "selected" : ""}`}
        >
          <button
            className={`agendaToggle ${task.completed ? "done" : ""}`}
            type="button"
            aria-label={`${task.completed ? "Mark incomplete" : "Mark complete"}: ${task.title}`}
            onClick={() => onToggleComplete(task.id)}
          >
            {task.completed ? <Check size={13} /> : null}
          </button>
          <div className="agendaTime">
            <strong>{task.start}</strong>
            <span>{formatDuration(minutesBetween(task.start, task.end))}</span>
          </div>
          <button className="agendaMain" type="button" onClick={() => onSelectTask(task.id)}>
            <span className="agendaTitleLine">
              <strong>{task.title}</strong>
              <em>{task.category}</em>
            </span>
            <span>{formatTaskDate(task)} - {task.end} - {task.linkedGoal || task.project}</span>
          </button>
          <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
        </article>
      ))}
    </div>
  );
}

function ReminderPanel({ reminders, setReminders, title = "Reminders" }) {
  return (
    <section className="dashboardPanel">
      <div className="panelHeader compact">
        <span>{title}</span>
        <MoreHorizontal size={17} />
      </div>
      <div className="reminderList">
        {reminders.map((reminder) => (
          <label key={reminder.id} className="reminderRow">
            <Bell size={16} />
            <span>
              <strong>{reminder.title}</strong>
              <small>{reminder.detail}</small>
            </span>
            <input
              type="checkbox"
              checked={reminder.enabled}
              onChange={() =>
                setReminders((current) =>
                  current.map((item) => (item.id === reminder.id ? { ...item, enabled: !item.enabled } : item)),
                )
              }
            />
          </label>
        ))}
      </div>
      <button className="linkButton" type="button">
        <Plus size={15} />
        Add reminder
      </button>
    </section>
  );
}

function OverviewView({
  tasks,
  inbox,
  goals,
  habits,
  reminders,
  setReminders,
  checkIns,
  selectedTaskId,
  setSelectedTaskId,
  setTasks,
  onAddTask,
  stats,
  focusTimer,
  onToggleFocusTimer,
  onResetFocusTimer,
  onEndFocusSession,
}) {
  return (
    <>
      <AnalyticsStrip stats={stats} />
      <GoalsProgress goals={goals} />
      <ProductLoopPanel tasks={tasks} goals={goals} habits={habits} checkIns={checkIns} stats={stats} />
      <div className="workspaceGrid">
        <div className="centerStack">
          <PlannerBoard
            tasks={tasks}
            inbox={inbox}
            selectedTaskId={selectedTaskId}
            setSelectedTaskId={setSelectedTaskId}
            setTasks={setTasks}
            onAddTask={onAddTask}
          />
          <WeeklyGlance stats={stats} />
        </div>
        <FocusRail
          reminders={reminders}
          setReminders={setReminders}
          checkIns={checkIns}
          focusTimer={focusTimer}
          onToggleFocusTimer={onToggleFocusTimer}
          onResetFocusTimer={onResetFocusTimer}
          onEndFocusSession={onEndFocusSession}
        />
      </div>
    </>
  );
}

function CalendarView({
  tasks,
  setTasks,
  selectedTaskId,
  setSelectedTaskId,
  onToggleTask,
  onDeleteTask,
  reminders,
  onAddTask,
  theme,
  onToggleTheme,
  onSetTheme,
  viewer,
  onSignOut,
  onSaveProfile,
  onSaveAvatar,
  onRemoveAvatar,
}) {
  const [selectedDate, setSelectedDate] = useState(() => getToday());
  const [calendarMode, setCalendarMode] = useState("Week");
  const weekStart = startOfWeek(selectedDate);
  const calendarDays = useMemo(() => getCalendarDays(selectedDate, selectedDate), [selectedDate]);
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? tasks[0];
  const scheduledMinutes = tasks.reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0);
  const focusBlocks = tasks.filter((task) => task.category === "Focus").length;
  const moveRange = (direction) => {
    setSelectedDate((current) => {
      if (calendarMode === "Day") return addDays(current, direction);
      if (calendarMode === "Month") return addMonths(current, direction);
      return addDays(current, direction * 7);
    });
  };
  const moveTask = (taskId, date, startMinutes) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    const duration = minutesBetween(task.start, task.end);
    const newStart = formatTimeFromMinutes(startMinutes);
    const newEnd = formatTimeFromMinutes(startMinutes + duration);
    const newDateKey = getDateKey(date);
    setTasks((current) =>
      current
        .map((item) => (item.id === taskId ? { ...item, dateKey: newDateKey, start: newStart, end: newEnd } : item))
        .sort(compareTasksBySchedule),
    );
    setSelectedTaskId(taskId);
    setSelectedDate(date);
  };

  return (
    <div className="calendarView">
      <CalendarToolbar
        calendarMode={calendarMode}
        selectedDate={selectedDate}
        weekStart={weekStart}
        scheduledMinutes={scheduledMinutes}
        focusBlocks={focusBlocks}
        activeReminders={reminders.filter((item) => item.enabled).length}
        selectedTask={selectedTask}
        onToday={() => setSelectedDate(getToday())}
        onMoveRange={moveRange}
        onSetMode={setCalendarMode}
        onAddTask={onAddTask}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSetTheme={onSetTheme}
        viewer={viewer}
        onSignOut={onSignOut}
        onSaveProfile={onSaveProfile}
        onSaveAvatar={onSaveAvatar}
        onRemoveAvatar={onRemoveAvatar}
      />
      <CalendarBoard
        tasks={tasks}
        calendarDays={calendarDays}
        calendarMode={calendarMode}
        selectedDate={selectedDate}
        selectedTaskId={selectedTask?.id}
        onSelectDate={setSelectedDate}
        onSelectTask={setSelectedTaskId}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onMoveTask={moveTask}
      />
    </div>
  );
}

function TasksView({ tasks, inbox, selectedTaskId, setSelectedTaskId, onToggleTask, onDeleteTask, onAddTask }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", ...new Set(tasks.map((task) => task.category))];
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? tasks.find((task) => !task.completed) ?? tasks[0];
  const visibleTasks = filter === "All" ? tasks : tasks.filter((task) => task.category === filter);
  const completedCount = tasks.filter((task) => task.completed).length;
  const sortedTasks = [...visibleTasks].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
  const openTasks = tasks.length - completedCount;
  const completionRate = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const scheduledMinutes = tasks.reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0);
  const completedMinutes = tasks
    .filter((task) => task.completed)
    .reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0);
  const focusMinutes = tasks
    .filter((task) => task.category === "Focus" || task.category === "Planning")
    .reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0);
  const highPriorityCount = tasks.filter((task) => task.priority === "High" && !task.completed).length;
  const nextTask = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start))[0];
  const priorityItems = ["High", "Medium", "Low"].map((priority) => {
    const matchingTasks = tasks.filter((task) => task.priority === priority);
    return {
      priority,
      count: matchingTasks.length,
      minutes: matchingTasks.reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0),
    };
  });
  const stageItems = [
    {
      label: "Next block",
      value: nextTask?.start ?? "--",
      detail: nextTask?.title ?? "Queue clear",
      icon: AlarmClock,
      color: "blue",
    },
    {
      label: "Focus load",
      value: formatDuration(focusMinutes),
      detail: `${tasks.filter((task) => task.category === "Focus" || task.category === "Planning").length} protected blocks`,
      icon: Focus,
      color: "violet",
    },
    {
      label: "High priority",
      value: highPriorityCount,
      detail: "Open critical tasks",
      icon: Target,
      color: "amber",
    },
    {
      label: "Completed",
      value: `${completedCount}/${tasks.length}`,
      detail: formatDuration(completedMinutes),
      icon: CheckCircle2,
      color: "green",
    },
  ];

  return (
    <div className="pageStack tasksPage">
      <section className="taskCommandHero">
        <div className="taskHeroCopy">
          <span className="eyebrow">Tasks</span>
          <h2>Today's execution queue</h2>
          <p>{openTasks} open - {formatDuration(scheduledMinutes)} scheduled - {inbox.length} inbox ideas.</p>
        </div>
        <div className="taskHeroProgress" aria-label={`${completionRate}% task completion`}>
          <div className="taskProgressDial" style={{ "--task-progress": `${completionRate * 3.6}deg` }}>
            <strong>{completionRate}%</strong>
            <span>Done</span>
          </div>
          <dl>
            <div>
              <dt>Scheduled</dt>
              <dd>{formatDuration(scheduledMinutes)}</dd>
            </div>
            <div>
              <dt>Completed</dt>
              <dd>{formatDuration(completedMinutes)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="taskStageStrip" aria-label="Task momentum">
        {stageItems.map((item) => {
          const ItemIcon = item.icon;
          return (
            <article key={item.label} className={`taskStageCard ${item.color}`}>
              <span>
                <ItemIcon size={17} />
              </span>
              <div>
                <small>{item.label}</small>
                <strong>{item.value}</strong>
                <em>{item.detail}</em>
              </div>
            </article>
          );
        })}
      </section>

      <div className="taskHub">
        <section className="dashboardPanel taskHubMain">
          <div className="panelHeader">
            <div>
              <span className="eyebrow">Queue</span>
              <h2>Scheduled work</h2>
            </div>
            <button className="primaryButton taskQueueAdd" type="button" onClick={onAddTask}>
              <Plus size={16} />
              Add task
            </button>
          </div>
          <div className="taskQueueToolbar">
            <div className="filterTabs" role="tablist" aria-label="Task category">
              {filters.map((item) => (
                <button key={item} className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)}>
                  {item}
                  <span>{item === "All" ? tasks.length : tasks.filter((task) => task.category === item).length}</span>
                </button>
              ))}
            </div>
            <span>{sortedTasks.length} shown</span>
          </div>
          <TaskAgendaList
            tasks={sortedTasks}
            selectedTaskId={selectedTask?.id}
            onSelectTask={setSelectedTaskId}
            onToggleComplete={onToggleTask}
            emptyLabel="No tasks match this filter."
          />
        </section>

        <aside className="taskSide">
          <TaskDetails
            task={selectedTask}
            onClose={() => setSelectedTaskId(null)}
            onToggleComplete={onToggleTask}
            onDelete={onDeleteTask}
          />
          <section className="dashboardPanel taskWorkloadPanel">
            <div className="panelHeader compact">
              <span>Priority workload</span>
              <SlidersHorizontal size={16} />
            </div>
            <div className="priorityWorkload">
              {priorityItems.map((item) => (
                <div key={item.priority} className="priorityWorkloadRow">
                  <span className={`priority ${item.priority.toLowerCase()}`}>{item.priority}</span>
                  <div>
                    <strong>{item.count} tasks</strong>
                    <ProgressBar value={scheduledMinutes ? Math.round((item.minutes / scheduledMinutes) * 100) : 0} color={item.priority === "High" ? "red" : item.priority === "Medium" ? "orange" : "green"} />
                  </div>
                  <b>{formatDuration(item.minutes)}</b>
                </div>
              ))}
            </div>
          </section>
          <section className="dashboardPanel">
            <div className="panelHeader compact">
              <span>Unscheduled</span>
              <button className="plainLink" type="button" onClick={onAddTask}>Schedule</button>
            </div>
            <ul className="compactList">
              {inbox.map((item) => (
                <li key={item}>
                  <Circle size={15} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function GoalsView({ goals, tasks, habits, onAddGoal, onScheduleGoal }) {
  const averageProgress = goals.length ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0;
  const bestStreak = habits.length ? Math.max(...habits.map((habit) => habit.streak)) : 0;
  const scopeSummary = goalScopeOptions.map((option) => {
    const matchingGoals = goals.filter((goal) => (goal.scope ?? "Month") === option.value);
    const average = matchingGoals.length
      ? Math.round(matchingGoals.reduce((sum, goal) => sum + goal.progress, 0) / matchingGoals.length)
      : 0;

    return { ...option, count: matchingGoals.length, average };
  });

  return (
    <div className="pageStack">
      <section className="pageHero">
        <div>
          <span className="eyebrow">Goals</span>
          <h2>{averageProgress}% average goal progress.</h2>
          <p>{goals.length} active goals - {habits.length} habits supporting them.</p>
        </div>
        <div className="goalHeroActions">
          <div className="viewStats">
            <ViewStat icon={Goal} label="Active" value={goals.length} detail="Tracked outcomes" />
            <ViewStat icon={Flame} label="Best streak" value={`${bestStreak}d`} detail="Habit support" color="orange" />
            <ViewStat icon={CheckCircle2} label="Linked tasks" value={tasks.length} detail="Scheduled today" color="green" />
          </div>
          <button className="primaryButton" type="button" onClick={onAddGoal}>
            <Plus size={17} />
            Add goal
          </button>
        </div>
      </section>

      <section className="goalScopeStrip" aria-label="Goal time horizons">
        {scopeSummary.map((scope) => {
          const ScopeIcon = goalIconMap[scope.iconKey];
          return (
            <article key={scope.value} className={`goalScopeStat ${scope.color}`}>
              <span>
                <ScopeIcon size={17} />
              </span>
              <div>
                <strong>{scope.count}</strong>
                <p>{scope.label}s</p>
              </div>
              <b>{scope.average}% avg</b>
            </article>
          );
        })}
      </section>

      <div className="goalsPageGrid">
        {goals.map((goal) => {
          const GoalIcon = getGoalIcon(goal);
          const meta = getGoalMeta(goal);
          const scope = goal.scope ?? "Month";
          const relatedTasks = goal.loop?.relatedTasks ?? tasks.filter((task) => isTaskLinkedToGoal(task, goal)).length;
          const completedTasks = goal.loop?.completedTasks ?? tasks.filter((task) => isTaskLinkedToGoal(task, goal) && task.completed).length;
          const relatedHabits = goal.loop?.relatedHabits ?? habits.filter((habit) => habit.goal === goal.label).length;

          return (
            <article key={goal.id} className="goalCardLarge">
              <div className="goalCardTop">
                <span className={`goalIcon ${goal.color}`}>
                  <GoalIcon size={20} />
                </span>
                <div>
                  <h2>{goal.label}</h2>
                  <p>{meta.target}</p>
                  <span className={`goalScopePill ${scope.toLowerCase()}`}>{scope} goal</span>
                </div>
                <strong>{goal.progress}%</strong>
              </div>
              <ProgressBar value={goal.progress} color={goal.color} />
              <div className="goalCardActions">
                <button className="secondaryButton" type="button" onClick={() => onScheduleGoal(goal)}>
                  <CalendarDays size={16} />
                  Schedule next task
                </button>
              </div>
              <dl className="goalMetaGrid">
                <div>
                  <dt>Next action</dt>
                  <dd>{meta.next}</dd>
                </div>
                <div>
                  <dt>Cadence</dt>
                  <dd>{meta.cadence}</dd>
                </div>
                <div>
                  <dt>Task signal</dt>
                  <dd>{completedTasks}/{relatedTasks}</dd>
                </div>
                <div>
                  <dt>Habit support</dt>
                  <dd>{relatedHabits} habits</dd>
                </div>
                <div>
                  <dt>Check-ins</dt>
                  <dd>{goal.loop?.checkInCount ?? 0} logs</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function FocusSessionPanel({ focusTimer, onToggleFocusTimer, onResetFocusTimer, onSetFocusTargetMinutes, onSelectFocusPreset, onEndFocusSession }) {
  const timerMeta = getFocusTimerMeta(focusTimer);
  const isRunning = Boolean(focusTimer?.running);

  return (
    <section className="focusConsole">
      <div className="panelHeader">
        <div>
          <span className="eyebrow">Current session</span>
          <h2>Focus timer</h2>
        </div>
        <span className={`livePill ${timerMeta.isComplete ? "done" : isRunning ? "running" : ""}`}>{timerMeta.isComplete ? "Complete" : isRunning ? "Running" : "Ready"}</span>
      </div>
      <div className="focusTimerReadout" aria-live="polite">
        <strong className="focusConsoleTimer">{timerMeta.display}</strong>
        <span>of {timerMeta.targetDisplay}</span>
      </div>
      <div className="focusTimeTarget">
        <label htmlFor="focusTargetMinutes">Session target</label>
        <div>
          <input
            id="focusTargetMinutes"
            type="number"
            min="1"
            max="180"
            value={timerMeta.targetMinutes}
            onChange={(event) => onSetFocusTargetMinutes(event.target.value)}
          />
          <span>minutes</span>
        </div>
      </div>
      <div className="focusTimerTrack" aria-label={`${timerMeta.progress}% of focus session complete`}>
        <span style={{ width: `${timerMeta.progress}%` }} />
      </div>
      <div className="focusPresetGrid" aria-label="Focus timer suggestions">
        {focusTimerPresets.map((preset) => (
          <button
            key={preset.id}
            className={timerMeta.targetMinutes === preset.minutes ? "active" : ""}
            type="button"
            aria-pressed={timerMeta.targetMinutes === preset.minutes}
            onClick={() => onSelectFocusPreset(preset.minutes)}
          >
            <strong>{preset.label}</strong>
            <span>{preset.minutes} min</span>
            <small>{preset.detail}</small>
          </button>
        ))}
      </div>
      <div className="focusConsoleControls">
        <button className="timerButton" type="button" onClick={onToggleFocusTimer} disabled={timerMeta.isComplete} aria-label={isRunning ? "Pause focus timer" : "Start focus timer"}>
          {isRunning ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <button className="stopButton" type="button" onClick={onResetFocusTimer} aria-label="Reset focus timer">
          <Square size={17} />
        </button>
      </div>
      <div className="focusProgress">
        <span>{timerMeta.isComplete ? "Session finished. Save it as a check-in when you are ready." : `${timerMeta.progress}% complete - ${formatDuration(timerMeta.remainingMinutes)} remaining`}</span>
        <ProgressBar value={timerMeta.progress} color="blue" />
      </div>
      <button className="secondaryButton full" type="button" onClick={onEndFocusSession} disabled={!timerMeta.elapsedSeconds}>
        <CheckCircle2 size={17} />
        End Session & Check-in
      </button>
    </section>
  );
}

function FocusView({
  tasks,
  reminders,
  setReminders,
  checkIns,
  selectedTaskId,
  setSelectedTaskId,
  onToggleTask,
  focusTimer,
  onToggleFocusTimer,
  onResetFocusTimer,
  onSetFocusTargetMinutes,
  onSelectFocusPreset,
  onEndFocusSession,
}) {
  const focusTasks = tasks.filter((task) => task.category === "Focus" || task.category === "Planning");
  const focusMinutes = focusTasks.reduce((sum, task) => sum + minutesBetween(task.start, task.end), 0);

  return (
    <div className="pageStack">
      <section className="pageHero">
        <div>
          <span className="eyebrow">Focus</span>
          <h2>{formatDuration(focusMinutes)} protected today.</h2>
          <p>{focusTasks.length} focus-ready blocks - {checkIns.length} recent work logs.</p>
        </div>
        <div className="viewStats">
          <ViewStat icon={Focus} label="Protected" value={formatDuration(focusMinutes)} detail="Focus + planning" />
          <ViewStat icon={Flame} label="Streak" value="12d" detail="Current run" color="orange" />
          <ViewStat icon={CheckCircle2} label="Check-ins" value={checkIns.length} detail="Recent logs" color="green" />
        </div>
      </section>

      <div className="focusLayout">
        <FocusSessionPanel
          focusTimer={focusTimer}
          onToggleFocusTimer={onToggleFocusTimer}
          onResetFocusTimer={onResetFocusTimer}
          onSetFocusTargetMinutes={onSetFocusTargetMinutes}
          onSelectFocusPreset={onSelectFocusPreset}
          onEndFocusSession={onEndFocusSession}
        />
        <section className="dashboardPanel">
          <div className="panelHeader">
            <div>
              <span className="eyebrow">Focus blocks</span>
              <h2>Today's protected work</h2>
            </div>
          </div>
          <TaskAgendaList
            tasks={focusTasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
            onToggleComplete={onToggleTask}
            emptyLabel="No focus blocks scheduled."
          />
        </section>
        <ReminderPanel reminders={reminders} setReminders={setReminders} title="Focus reminders" />
      </div>
    </div>
  );
}

function HabitsView({ habits, onToggleHabit, onScheduleHabit }) {
  const totalChecks = habits.flatMap((habit) => habit.checks);
  const completedChecks = totalChecks.filter(Boolean).length;
  const completionRate = totalChecks.length ? Math.round((completedChecks / totalChecks.length) * 100) : 0;
  const bestStreak = habits.length ? Math.max(...habits.map((habit) => habit.streak)) : 0;

  return (
    <div className="pageStack">
      <section className="pageHero">
        <div>
          <span className="eyebrow">Habits</span>
          <h2>{completionRate}% weekly habit completion.</h2>
          <p>{completedChecks} of {totalChecks.length} checkmarks completed.</p>
        </div>
        <div className="viewStats">
          <ViewStat icon={LayoutList} label="Tracked" value={habits.length} detail="Active habits" />
          <ViewStat icon={Check} label="Completed" value={completedChecks} detail="This week" color="green" />
          <ViewStat icon={Flame} label="Best streak" value={`${bestStreak}d`} detail="Current habit" color="orange" />
        </div>
      </section>

      <section className="dashboardPanel habitBoard">
        <div className="habitHeaderRow">
          <span>Habit</span>
          <div>
            {days.map((day, index) => (
              <b key={`${day}-${index}`}>{day}</b>
            ))}
          </div>
          <span>Streak</span>
        </div>
        {habits.map((habit) => (
          <article key={habit.id} className="habitRow">
            <div className="habitName">
              <span className={`goalIcon ${habit.color}`}>
                <CheckCircle2 size={17} />
              </span>
              <div>
                <strong>{habit.name}</strong>
                <small>{habit.cue} - {habit.goal}</small>
              </div>
            </div>
            <div className="habitWeek">
              {habit.checks.map((checked, index) => (
                <button
                  key={`${habit.id}-${index}`}
                  className={`habitDay ${checked ? "done" : ""}`}
                  type="button"
                  aria-pressed={checked}
                  aria-label={`${habit.name} ${days[index]}`}
                  onClick={() => onToggleHabit(habit.id, index)}
                >
                  {checked ? <Check size={13} /> : days[index]}
                </button>
              ))}
            </div>
            <strong className="habitStreak">{habit.streak}d</strong>
            <button className="habitScheduleButton" type="button" onClick={() => onScheduleHabit(habit)}>
              <CalendarDays size={15} />
              Schedule
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

function AnalyticsView({ tasks, goals, habits, checkIns, stats }) {
  const habitChecks = habits.flatMap((habit) => habit.checks);
  const habitCompletion = habitChecks.length ? Math.round((habitChecks.filter(Boolean).length / habitChecks.length) * 100) : 0;
  const completedTasks = tasks.filter((task) => task.completed);
  const linkedTasks = tasks.filter((task) => task.goalId || task.habitId || task.linkedGoal || task.linkedHabit);
  const linkedCheckIns = checkIns.filter((checkIn) => checkIn.goalId || checkIn.habitId || checkIn.taskId);
  const weakestGoal = [...goals].sort((a, b) => a.progress - b.progress)[0];
  const highPriorityOpen = tasks.filter((task) => task.priority === "High" && !task.completed).length;
  const loopCoverage = tasks.length ? Math.round((linkedTasks.length / tasks.length) * 100) : 0;
  const recommendations = [
    highPriorityOpen
      ? `${highPriorityOpen} high-priority task${highPriorityOpen > 1 ? "s need" : " needs"} a finish or reschedule decision.`
      : "High-priority work is under control.",
    habitCompletion < 80
      ? "Habit consistency is below 80%, so protect one routine block on the calendar."
      : "Habits are supporting the current goal system well.",
    weakestGoal
      ? `${weakestGoal.label} has the lowest momentum. Schedule its next action from Goals.`
      : "Create a measurable goal to anchor the loop.",
    linkedCheckIns.length
      ? `${linkedCheckIns.length} linked check-in${linkedCheckIns.length === 1 ? "" : "s"} can now explain task, goal, and habit progress.`
      : "Start linking check-ins so analytics can explain what moved progress.",
  ];

  return (
    <div className="pageStack analyticsView">
      <AnalyticsStrip stats={stats} />
      <WeeklyGlance stats={stats} />
      <section className="analyticsInsightGrid" aria-label="Productivity loop analytics">
        <article className="dashboardPanel analyticsInsight">
          <span className="goalIcon blue">
            <ListChecks size={16} />
          </span>
          <div>
            <small>Task loop coverage</small>
            <strong>{loopCoverage}%</strong>
            <p>{linkedTasks.length} of {tasks.length} tasks are tied to a goal or habit.</p>
          </div>
        </article>
        <article className="dashboardPanel analyticsInsight">
          <span className="goalIcon green">
            <CheckCircle2 size={16} />
          </span>
          <div>
            <small>Completion signal</small>
            <strong>{completedTasks.length}/{tasks.length}</strong>
            <p>Completed tasks automatically create check-ins for the timeline.</p>
          </div>
        </article>
        <article className="dashboardPanel analyticsInsight">
          <span className="goalIcon violet">
            <Target size={16} />
          </span>
          <div>
            <small>Goal average</small>
            <strong>{stats.goalAverage}%</strong>
            <p>{weakestGoal ? `${weakestGoal.label} needs the next push.` : "No goals yet."}</p>
          </div>
        </article>
      </section>
      <div className="analyticsDeepGrid">
        <section className="dashboardPanel chartPanel">
          <div className="panelHeader">
            <div>
              <span className="eyebrow">Trend</span>
              <h2>Productivity score</h2>
            </div>
            <strong>{stats.score}/100</strong>
          </div>
          <MiniBars values={stats.scoreTrend} />
          <p>{recommendations[0]}</p>
        </section>

        <section className="dashboardPanel chartPanel">
          <div className="panelHeader">
            <div>
              <span className="eyebrow">Habits</span>
              <h2>Habit consistency</h2>
            </div>
            <strong>{habitCompletion}%</strong>
          </div>
          <Sparkline values={[62, 66, 58, 71, 76, 82, habitCompletion]} color="green" />
          <p>{recommendations[1]}</p>
        </section>

        <section className="dashboardPanel goalMomentum">
          <div className="panelHeader compact">
            <span>Goal momentum</span>
            <BarChart3 size={17} />
          </div>
          {goals.map((goal) => (
            <div key={goal.id} className="goalMomentumRow">
              <span>{goal.label}</span>
              <ProgressBar value={goal.progress} color={goal.color} />
              <b>{goal.progress}%</b>
            </div>
          ))}
        </section>

        <section className="dashboardPanel">
          <div className="panelHeader compact">
            <span>Time distribution</span>
            <MoreHorizontal size={17} />
          </div>
          <div className="donutPanel analyticsDonut">
            <div className="donut" style={{ background: getDonutBackground(stats.distribution) }} aria-hidden="true" />
            <ul>
              {stats.distribution.items.map((item) => (
                <li key={item.key}>
                  <span className={`legend ${item.className}`} />
                  {item.label}
                  <b>{item.value}%</b>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dashboardPanel analyticsRecommendations">
          <div className="panelHeader compact">
            <span>Next best moves</span>
            <Sparkles size={17} />
          </div>
          <ul>
            {recommendations.map((item) => (
              <li key={item}>
                <CheckCircle2 size={15} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function CheckInsView({ checkIns, setCheckIns, tasks, goals, habits }) {
  const [reflection, setReflection] = useState("");
  const [focusTime, setFocusTime] = useState("3h");
  const [energy, setEnergy] = useState("Steady");
  const [blockers, setBlockers] = useState("");
  const [linkedTaskId, setLinkedTaskId] = useState("");
  const [linkedGoalId, setLinkedGoalId] = useState("");
  const [linkedHabitId, setLinkedHabitId] = useState("");
  const openTasks = tasks.filter((task) => !task.completed);
  const linkedTask = tasks.find((task) => String(task.id) === linkedTaskId);
  const linkedGoal = goals.find((goal) => String(goal.id) === linkedGoalId);
  const linkedHabit = habits.find((habit) => String(habit.id) === linkedHabitId);

  const selectTask = (value) => {
    setLinkedTaskId(value);
    const task = tasks.find((item) => String(item.id) === value);
    if (!task) return;
    if (task.goalId) setLinkedGoalId(String(task.goalId));
    if (task.habitId) setLinkedHabitId(String(task.habitId));
  };

  const saveReflection = (event) => {
    event.preventDefault();
    const note = reflection.trim();
    const blockerNote = blockers.trim();
    const outcome = note || "Closed the day with focused execution";
    const blockerSummary = blockerNote ? `Follow-up: ${blockerNote}` : "No blockers reported";
    setCheckIns((current) => [
      {
        id: Date.now(),
        when: "Just now",
        value: `${focusTime} focused - ${energy} energy - ${outcome}. ${blockerSummary}.`,
        checkedInAt: new Date().toISOString(),
        focusMinutes: parseFocusMinutes(focusTime),
        taskId: linkedTask?.id ?? null,
        linkedTask: linkedTask?.title ?? "",
        goalId: linkedGoal?.id ?? null,
        linkedGoal: linkedGoal?.label ?? "",
        habitId: linkedHabit?.id ?? null,
        linkedHabit: linkedHabit?.name ?? "",
      },
      ...current,
    ]);
    setReflection("");
    setBlockers("");
    setLinkedTaskId("");
    setLinkedGoalId("");
    setLinkedHabitId("");
  };

  return (
    <div className="pageStack checkInsView">
      <section className="pageHero">
        <div>
          <span className="eyebrow">Check-ins</span>
          <h2>{checkIns.length} work logs captured.</h2>
          <p>Latest entry: {checkIns[0]?.value ?? "No check-ins yet."}</p>
        </div>
        <div className="viewStats">
          <ViewStat icon={CheckCircle2} label="Logs" value={checkIns.length} detail="Recent entries" color="green" />
          <ViewStat icon={Focus} label="Avg focus" value="3h 48m" detail="Last 7 days" />
          <ViewStat icon={Flame} label="Streak" value="12d" detail="Daily closeout" color="orange" />
        </div>
      </section>

      <div className="checkInLayout">
        <form className="dashboardPanel checkInComposer" onSubmit={saveReflection}>
          <div className="checkInComposerHeader">
            <div>
              <span className="eyebrow">Today</span>
              <h2>Work check-in</h2>
            </div>
            <span className="checkInStatus">Draft</span>
          </div>

          <div className="checkInFormGrid">
            <label>
              Focus time
              <MarkSelect label="Focus time" value={focusTime} onChange={setFocusTime} options={checkInFocusOptions} />
            </label>
            <fieldset className="energySelector">
              <legend>Energy</legend>
              <div>
                {checkInEnergyOptions.map((option) => (
                  <button
                    key={option}
                    className={energy === option ? "active" : ""}
                    type="button"
                    aria-pressed={energy === option}
                    onClick={() => setEnergy(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="checkInFormGrid">
            <label>
              Linked task
              <MarkSelect
                label="Linked task"
                value={linkedTaskId}
                onChange={selectTask}
                options={[
                  { value: "", label: "No task", detail: "Keep independent" },
                  ...openTasks.map((task) => ({
                    value: String(task.id),
                    label: task.title,
                    detail: `${task.project} - ${task.start} to ${task.end}`,
                  })),
                ]}
              />
            </label>
            <label>
              Linked goal
              <MarkSelect
                label="Linked goal"
                value={linkedGoalId}
                onChange={setLinkedGoalId}
                options={[
                  { value: "", label: "No goal", detail: "General reflection" },
                  ...goals.map((goal) => {
                    const meta = getGoalMeta(goal);
                    return {
                      value: String(goal.id),
                      label: goal.label,
                      detail: `${meta.cadence} - ${goal.progress}%`,
                    };
                  }),
                ]}
              />
            </label>
            <label>
              Linked habit
              <MarkSelect
                label="Linked habit"
                value={linkedHabitId}
                onChange={setLinkedHabitId}
                options={[
                  { value: "", label: "No habit", detail: "No habit link" },
                  ...habits.map((habit) => ({
                    value: String(habit.id),
                    label: habit.name,
                    detail: `${habit.streak} day streak`,
                  })),
                ]}
              />
            </label>
          </div>

          <label>
            Key outcome
            <textarea
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              placeholder="Shipped onboarding polish and cleared review feedback."
              rows="5"
            />
          </label>
          <label>
            Blockers or follow-up
            <input value={blockers} onChange={(event) => setBlockers(event.target.value)} placeholder="Waiting on final analytics copy" />
          </label>

          <div className="checkInPreview">
            <span>Preview</span>
            <p>
              {focusTime} focused - {energy} energy - {reflection.trim() || "Outcome not written yet."}
              {linkedGoal ? ` - Goal: ${linkedGoal.label}` : ""}
            </p>
          </div>

          <div className="checkInComposerActions">
            <button className="primaryButton" type="submit">
              <CheckCircle2 size={17} />
              Save check-in
            </button>
          </div>
        </form>

        <section className="dashboardPanel">
          <div className="panelHeader compact">
            <span>Timeline</span>
            <MoreHorizontal size={17} />
          </div>
          <div className="checkInTimeline">
            {checkIns.map((checkIn) => (
              <article key={checkIn.id}>
                <span>
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <strong>{checkIn.when}</strong>
                  <p>{checkIn.value}</p>
                  {checkIn.linkedGoal || checkIn.linkedTask || checkIn.linkedHabit ? (
                    <small>
                      {[checkIn.linkedTask, checkIn.linkedGoal, checkIn.linkedHabit].filter(Boolean).join(" / ")}
                    </small>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MainContent({
  activeNav,
  tasks,
  setTasks,
  inbox,
  goals,
  habits,
  reminders,
  setReminders,
  checkIns,
  setCheckIns,
  selectedTaskId,
  setSelectedTaskId,
  stats,
  onAddTask,
  onAddGoal,
  onScheduleGoal,
  onScheduleHabit,
  onToggleTask,
  onDeleteTask,
  onToggleHabit,
  theme,
  onToggleTheme,
  onSetTheme,
  viewer,
  onSignOut,
  onSaveProfile,
  onSaveAvatar,
  onRemoveAvatar,
  focusTimer,
  onToggleFocusTimer,
  onResetFocusTimer,
  onSetFocusTargetMinutes,
  onSelectFocusPreset,
  onEndFocusSession,
}) {
  let content;

  if (activeNav === "Calendar") {
    content = (
      <CalendarView
        tasks={tasks}
        setTasks={setTasks}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        reminders={reminders}
        onAddTask={onAddTask}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSetTheme={onSetTheme}
        viewer={viewer}
        onSignOut={onSignOut}
        onSaveProfile={onSaveProfile}
        onSaveAvatar={onSaveAvatar}
        onRemoveAvatar={onRemoveAvatar}
      />
    );
  } else if (activeNav === "Tasks") {
    content = (
      <TasksView
        tasks={tasks}
        inbox={inbox}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onAddTask={onAddTask}
      />
    );
  } else if (activeNav === "Goals") {
    content = <GoalsView goals={goals} tasks={tasks} habits={habits} onAddGoal={onAddGoal} onScheduleGoal={onScheduleGoal} />;
  } else if (activeNav === "Focus") {
    content = (
      <FocusView
        tasks={tasks}
        reminders={reminders}
        setReminders={setReminders}
        checkIns={checkIns}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        onToggleTask={onToggleTask}
        focusTimer={focusTimer}
        onToggleFocusTimer={onToggleFocusTimer}
        onResetFocusTimer={onResetFocusTimer}
        onSetFocusTargetMinutes={onSetFocusTargetMinutes}
        onSelectFocusPreset={onSelectFocusPreset}
        onEndFocusSession={onEndFocusSession}
      />
    );
  } else if (activeNav === "Habits") {
    content = <HabitsView habits={habits} onToggleHabit={onToggleHabit} onScheduleHabit={onScheduleHabit} />;
  } else if (activeNav === "Analytics") {
    content = <AnalyticsView tasks={tasks} goals={goals} habits={habits} checkIns={checkIns} stats={stats} />;
  } else if (activeNav === "Check-ins") {
    content = <CheckInsView checkIns={checkIns} setCheckIns={setCheckIns} tasks={tasks} goals={goals} habits={habits} />;
  } else {
    content = (
      <OverviewView
        tasks={tasks}
        inbox={inbox}
        goals={goals}
        habits={habits}
        reminders={reminders}
        setReminders={setReminders}
        checkIns={checkIns}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        setTasks={setTasks}
        onAddTask={onAddTask}
        stats={stats}
        focusTimer={focusTimer}
        onToggleFocusTimer={onToggleFocusTimer}
        onResetFocusTimer={onResetFocusTimer}
        onEndFocusSession={onEndFocusSession}
      />
    );
  }

  return (
    <div key={activeNav} className="sectionTransition" data-section={activeNav}>
      {content}
    </div>
  );
}

function ScheduleDialog({ open, onClose, onCreate, goals, habits, draft }) {
  const [title, setTitle] = useState("");
  const [dateKey, setDateKey] = useState(() => getDateKey(getToday()));
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [priority, setPriority] = useState("High");
  const [category, setCategory] = useState("Focus");
  const [linkedGoalId, setLinkedGoalId] = useState("");
  const [linkedHabitId, setLinkedHabitId] = useState("");
  const [project, setProject] = useState("Personal");
  const [reminder, setReminder] = useState(true);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const linkedGoal = goals.find((goal) => String(goal.id) === linkedGoalId);
  const linkedHabit = habits.find((habit) => String(habit.id) === linkedHabitId);
  const projectOptions = [...new Set(["Personal", ...linkedAreaOptions, ...goals.map((goal) => getGoalMeta(goal).linkedProject)])];

  const resetForm = () => {
    setTitle("");
    setDateKey(getDateKey(getToday()));
    setStart("09:00");
    setEnd("10:00");
    setPriority("High");
    setCategory("Focus");
    setLinkedGoalId("");
    setLinkedHabitId("");
    setProject("Personal");
    setReminder(true);
    setNotes("");
    setError("");
  };

  useEffect(() => {
    if (!open) return;
    setError("");
    if (!draft) return;
    setTitle(draft.title ?? "");
    setDateKey(draft.dateKey ?? getDateKey(getToday()));
    setStart(draft.start ?? "09:00");
    setEnd(draft.end ?? "10:00");
    setPriority(draft.priority ?? "High");
    setCategory(draft.category ?? "Focus");
    setLinkedGoalId(draft.goalId ? String(draft.goalId) : "");
    setLinkedHabitId(draft.habitId ? String(draft.habitId) : "");
    setProject(draft.project ?? "Personal");
    setReminder(draft.reminder ?? true);
    setNotes(draft.notes ?? "");
  }, [open, draft]);

  const close = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!open) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const selectGoal = (value) => {
    setLinkedGoalId(value);
    const goal = goals.find((item) => String(item.id) === value);
    if (goal) setProject(getGoalMeta(goal).linkedProject);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Add a task name before scheduling.");
      return;
    }
    if (timeToMinutes(end) <= timeToMinutes(start)) {
      setError("End time must be after start time.");
      return;
    }
    onCreate({
      id: Date.now(),
      dateKey,
      title: title.trim(),
      project,
      start,
      end,
      category,
      color: linkedGoal?.color ?? (category === "Meeting" ? "amber" : category === "Health" ? "green" : category === "Creation" ? "violet" : "blue"),
      completed: false,
      notes: notes.trim() || (linkedGoal ? `Supports ${linkedGoal.label}.` : "New scheduled block. Add more detail as you plan."),
      reminder,
      priority,
      goalId: linkedGoal?.id ?? null,
      linkedGoal: linkedGoal?.label ?? "",
      habitId: linkedHabit?.id ?? null,
      linkedHabit: linkedHabit?.name ?? "",
    });
    resetForm();
    onClose();
  };

  return (
    <div className="modalBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <form className="scheduleDialog" onSubmit={submit} aria-label="Schedule a task">
        <div className="dialogHeader">
          <div>
            <h2>Add / Schedule Task</h2>
            <p>Place new work directly into your calendar.</p>
          </div>
          <IconButton label="Close dialog" onClick={close}>
            <X size={18} />
          </IconButton>
        </div>
        <label>
          Task name
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Draft launch plan" autoFocus />
        </label>
        <div className="formGrid">
          <label>
            Date
            <input type="date" value={dateKey} onChange={(event) => setDateKey(event.target.value)} />
          </label>
          <label>
            Start
            <input type="time" value={start} onChange={(event) => setStart(event.target.value)} />
          </label>
          <label>
            End
            <input type="time" value={end} onChange={(event) => setEnd(event.target.value)} />
          </label>
        </div>
        <div className="formGrid">
          <label>
            Priority
            <MarkSelect label="Priority" value={priority} onChange={setPriority} options={taskPriorityOptions} />
          </label>
          <label>
            Category
            <MarkSelect label="Category" value={category} onChange={setCategory} options={taskCategoryOptions} />
          </label>
        </div>
        <div className="formGrid">
          <label>
            Linked goal
            <MarkSelect
              label="Linked goal"
              value={linkedGoalId}
              onChange={selectGoal}
              options={[
                { value: "", label: "No goal", detail: "Standalone task" },
                ...goals.map((goal) => {
                  const meta = getGoalMeta(goal);
                  return {
                    value: String(goal.id),
                    label: goal.label,
                    detail: `${meta.linkedProject} - ${goal.progress}%`,
                  };
                }),
              ]}
            />
          </label>
          <label>
            Linked habit
            <MarkSelect
              label="Linked habit"
              value={linkedHabitId}
              onChange={setLinkedHabitId}
              options={[
                { value: "", label: "No habit", detail: "No habit link" },
                ...habits.map((habit) => ({
                  value: String(habit.id),
                  label: habit.name,
                  detail: `${habit.streak} day streak`,
                })),
              ]}
            />
          </label>
        </div>
        <label>
          Linked area
          <MarkSelect
            label="Linked area"
            value={project}
            onChange={setProject}
            options={projectOptions.map((option) => ({
              value: option,
              label: option,
              detail: option === "Other" ? "Custom area" : "Workspace area",
            }))}
          />
        </label>
        <label>
          Notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What should be true when this task is done?" rows="3" />
        </label>
        <label className="inlineToggle">
          <input type="checkbox" checked={reminder} onChange={(event) => setReminder(event.target.checked)} />
          <span>Remind me before this block starts</span>
        </label>
        {error ? <p className="formError" role="alert">{error}</p> : null}
        <div className="dialogActions">
          <button className="quietButton" type="button" onClick={close}>
            Cancel
          </button>
          <button className="primaryButton" type="submit">
            <Plus size={17} />
            Schedule
          </button>
        </div>
      </form>
    </div>
  );
}

function GoalDialog({ open, onClose, onCreate }) {
  const [scope, setScope] = useState("Month");
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [project, setProject] = useState("Health");
  const [customProject, setCustomProject] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const selectedScope = goalScopeOptions.find((option) => option.value === scope) ?? goalScopeOptions[1];
  const SelectedIcon = goalIconMap[selectedScope.iconKey];

  const resetForm = () => {
    setScope("Month");
    setTitle("");
    setTarget("");
    setNextAction("");
    setProject("Health");
    setCustomProject("");
    setProgress(0);
    setError("");
  };

  const selectScope = (option) => {
    setScope(option.value);
    setProject(option.defaultArea);
  };

  const close = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    setError("");
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Add a goal name first.");
      return;
    }
    const linkedProject = project === "Other" ? customProject.trim() || "Other" : project;

    onCreate({
      id: Date.now(),
      label: title.trim(),
      progress: Number(progress),
      color: selectedScope.color,
      iconKey: selectedScope.iconKey,
      scope,
      meta: {
        target: target.trim() || selectedScope.targetPlaceholder,
        next: nextAction.trim() || selectedScope.nextPlaceholder,
        cadence: selectedScope.cadence,
        linkedProject,
      },
    });
    resetForm();
    onClose();
  };

  return (
    <div className="modalBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <form className="scheduleDialog goalDialog" onSubmit={submit} aria-label="Add goal">
        <div className="dialogHeader">
          <div>
            <h2>Add Goal</h2>
            <p>Choose the horizon and define the next measurable outcome.</p>
          </div>
          <IconButton label="Close dialog" onClick={close}>
            <X size={18} />
          </IconButton>
        </div>

        <div className="goalTypeGrid" role="radiogroup" aria-label="Goal time horizon">
          {goalScopeOptions.map((option) => {
            const OptionIcon = goalIconMap[option.iconKey];
            const active = scope === option.value;
            return (
              <button
                key={option.value}
                className={active ? "active" : ""}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => selectScope(option)}
              >
                <span className={`goalTypeIcon ${option.color}`}>
                  <OptionIcon size={17} />
                </span>
                <strong>{option.label}</strong>
                <small>{option.detail}</small>
              </button>
            );
          })}
        </div>

        <label>
          Goal name
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={selectedScope.goalPlaceholder} autoFocus />
        </label>
        <label>
          Target outcome
          <input value={target} onChange={(event) => setTarget(event.target.value)} placeholder={selectedScope.targetPlaceholder} />
        </label>
        <div className="formGrid">
          <label>
            Next action
            <input value={nextAction} onChange={(event) => setNextAction(event.target.value)} placeholder={selectedScope.nextPlaceholder} />
          </label>
          <label>
            Linked area
            <MarkSelect
              label="Linked area"
              value={project}
              onChange={setProject}
              options={linkedAreaOptions.map((area) => ({
                value: area,
                label: area,
                detail: area === "Other" ? "Write your own" : "Goal area",
              }))}
            />
          </label>
          {project === "Other" ? (
            <label>
              Custom area
              <input value={customProject} onChange={(event) => setCustomProject(event.target.value)} placeholder="Community" />
            </label>
          ) : null}
        </div>

        <label className="goalProgressField">
          Starting progress
          <div className="goalProgressPreview">
            <ProgressBar value={Number(progress)} color={selectedScope.color} />
            <strong>{progress}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={progress}
            onChange={(event) => setProgress(event.target.value)}
          />
        </label>

        <div className="goalCadenceCallout">
          <span className={`goalTypeIcon ${selectedScope.color}`}>
            <SelectedIcon size={17} />
          </span>
          <div>
            <small>Review rhythm</small>
            <strong>{selectedScope.cadence}</strong>
          </div>
        </div>

        {error ? <p className="formError" role="alert">{error}</p> : null}
        <div className="dialogActions">
          <button className="quietButton" type="button" onClick={close}>
            Cancel
          </button>
          <button className="primaryButton" type="submit">
            <Plus size={17} />
            Create goal
          </button>
        </div>
      </form>
    </div>
  );
}

function LoadingScreen({ theme, isWorkspaceLoading }) {
  const loadingSteps = [
    { label: "Calendar", icon: CalendarDays },
    { label: "Tasks", icon: ListChecks },
    { label: "Focus", icon: Focus },
  ];
  const statusText = isWorkspaceLoading ? "Preparing your workspace" : "Opening Mark";

  return (
    <main className={`appShell loadingShell ${theme === "dark" ? "darkTheme" : ""}`} aria-busy="true" aria-live="polite">
      <section className="loadingStage" aria-label={statusText}>
        <div className="loadingAura" aria-hidden="true" />
        <div className="loadingCard">
          <div className="loadingBrand">
            <div className="loadingMark" aria-hidden="true">
              <img src={markLogoIconSrc} alt="" draggable="false" />
            </div>
            <div>
              <strong>Mark</strong>
              <p>{statusText}</p>
            </div>
          </div>

          <div className="loadingTrace" aria-hidden="true">
            <span />
          </div>

          <div className="loadingGrid" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="loadingSteps" aria-hidden="true">
            {loadingSteps.map((item) => {
              const StepIcon = item.icon;
              return (
                <span key={item.label}>
                  <StepIcon size={14} />
                  {item.label}
                </span>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export function App() {
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [habits, setHabits] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [goals, setGoals] = useState([]);
  const [areas, setAreas] = useState([]);
  const [onboardingProfile, setOnboardingProfile] = usePersistentState("mark.onboarding.v1", null);
  const [authUser, setAuthUser] = useState(null);
  const [viewer, setViewer] = useState(buildViewer(null, null));
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(true);
  const [workspaceError, setWorkspaceError] = useState("");
  const [activeNav, setActiveNav] = useState("Overview");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [taskDraft, setTaskDraft] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [theme, setTheme] = usePersistentState("mark.theme.v1", "light");
  const [entryView, setEntryView] = useState(getRouteFromHash);
  const [focusTimer, setFocusTimer] = useState({
    running: false,
    elapsedSeconds: 0,
    targetMinutes: focusTimerPresets[0].minutes,
  });

  const loadUserWorkspace = async (user) => {
    setIsWorkspaceLoading(true);
    setWorkspaceError("");

    try {
      const snapshot = await getWorkspaceSnapshot();
      const responses = [
        snapshot.profile,
        snapshot.areas,
        snapshot.goals,
        snapshot.habits,
        snapshot.habitEntries,
        snapshot.tasks,
        snapshot.reminders,
        snapshot.checkIns,
        snapshot.focusSessions,
        snapshot.attachments,
      ];
      const firstError = responses.find((response) => response.error)?.error;
      if (firstError) throw firstError;

      const nextWorkspace = mapWorkspaceSnapshot(snapshot, user);
      setViewer(nextWorkspace.viewer);
      setAreas(nextWorkspace.areas);
      setTasks(nextWorkspace.tasks);
      setGoals(nextWorkspace.goals);
      setHabits(nextWorkspace.habits);
      setReminders(nextWorkspace.reminders);
      setCheckIns(nextWorkspace.checkIns);
      setInbox([]);
      setSelectedTaskId(nextWorkspace.tasks[0]?.id ?? null);
    } catch (error) {
      setWorkspaceError(error instanceof Error ? error.message : "Could not load your workspace.");
      setTasks([]);
      setGoals([]);
      setHabits([]);
      setReminders([]);
      setCheckIns([]);
      setInbox([]);
      setSelectedTaskId(null);
    } finally {
      setIsWorkspaceLoading(false);
    }
  };

  const resetWorkspaceForSignedOutUser = () => {
    setAuthUser(null);
    setViewer(buildViewer(null, null));
    setAreas([]);
    setTasks([]);
    setGoals([]);
    setHabits([]);
    setReminders([]);
    setCheckIns([]);
    setInbox([]);
    setSelectedTaskId(null);
    setWorkspaceError("");
    setIsWorkspaceLoading(false);
    setFocusTimer((current) => ({ ...current, running: false, elapsedSeconds: 0 }));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setAppReady(true), 950);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!focusTimer.running) return undefined;
    const timer = window.setInterval(() => {
      setFocusTimer((current) => {
        if (!current.running) return current;
        const { targetSeconds } = getFocusTimerMeta(current);
        const elapsedSeconds = Math.min(current.elapsedSeconds + 1, targetSeconds);
        return {
          ...current,
          elapsedSeconds,
          running: elapsedSeconds >= targetSeconds ? false : current.running,
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [focusTimer.running]);

  useEffect(() => {
    const syncRoute = () => setEntryView(getRouteFromHash());
    window.addEventListener("hashchange", syncRoute);
    if (!window.location.hash) {
      window.history.replaceState(null, "", getHashForRoute("landing"));
    }
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    let isMounted = true;

    getSession().then(({ data }) => {
      if (!isMounted) return;
      if (!data.session?.user) {
        resetWorkspaceForSignedOutUser();
        return;
      }
      setAuthUser(data.session.user);
      loadUserWorkspace(data.session.user);
      const currentView = getRouteFromHash();
      if (currentView === "login" || currentView === "signup") {
        window.location.hash = getHashForRoute("app");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        resetWorkspaceForSignedOutUser();
        window.location.hash = getHashForRoute("landing");
        return;
      }
      if (!session?.user || (event !== "SIGNED_IN" && event !== "TOKEN_REFRESHED")) return;
      setAuthUser(session.user);
      loadUserWorkspace(session.user);
      const currentView = getRouteFromHash();
      if (currentView === "login" || currentView === "signup") {
        window.location.hash = getHashForRoute("app");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setTasks((current) => normalizeTaskDates(current));
  }, [setTasks]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const loopGoals = useMemo(() => deriveGoalProgress(goals, tasks, habits, checkIns), [goals, tasks, habits, checkIns]);
  const areaLookup = useMemo(() => createAreaLookup(areas), [areas]);

  const stats = useMemo(() => {
    return buildWorkspaceAnalytics(tasks, habits, loopGoals, checkIns);
  }, [tasks, habits, loopGoals, checkIns]);

  const createTask = async (task) => {
    const scheduledTask = { dateKey: getDateKey(getToday()), ...task };
    setTasks((current) => [...current, scheduledTask].sort(compareTasksBySchedule));
    setSelectedTaskId(scheduledTask.id);

    if (!authUser) return;

    const area = areaLookup.byName.get(scheduledTask.project);
    const { data, error } = await createUserRow("tasks", toTaskInsert(scheduledTask, area));
    if (error) {
      setWorkspaceError(error.message);
      return;
    }

    if (data) {
      const savedTask = mapSupabaseTask(data, areaLookup.byId, new Map(), new Map());
      setTasks((current) => current.map((item) => (item.id === scheduledTask.id ? savedTask : item)).sort(compareTasksBySchedule));
      setSelectedTaskId(savedTask.id);
    }
  };

  const createGoal = async (goal) => {
    setGoals((current) => [goal, ...current]);
    setActiveNav("Goals");

    if (!authUser) return;

    const meta = getGoalMeta(goal);
    const area = areaLookup.byName.get(meta.linkedProject);
    const { data, error } = await createUserRow("goals", toGoalInsert(goal, area));
    if (error) {
      setWorkspaceError(error.message);
      return;
    }

    if (data) {
      const savedGoal = mapSupabaseGoal(data, areaLookup.byId);
      setGoals((current) => current.map((item) => (item.id === goal.id ? savedGoal : item)));
    }
  };

  const openTaskDialog = (draft = null) => {
    setTaskDraft(draft);
    setIsDialogOpen(true);
  };

  const closeTaskDialog = () => {
    setIsDialogOpen(false);
    setTaskDraft(null);
  };

  const scheduleGoalTask = (goal) => {
    const meta = getGoalMeta(goal);
    openTaskDialog({
      title: meta.next,
      dateKey: getDateKey(getToday()),
      start: "09:00",
      end: "10:00",
      priority: "High",
      category: goal.scope === "Day" ? "Focus" : "Planning",
      project: meta.linkedProject,
      goalId: goal.id,
      notes: `Next action for ${goal.label}: ${meta.target}`,
    });
  };

  const scheduleHabitTask = (habit) => {
    const linkedGoal = loopGoals.find((goal) => goal.label === habit.goal || String(goal.id) === String(habit.goalId));
    const start = parseCueTime(habit.cue);
    openTaskDialog({
      title: habit.name,
      dateKey: getDateKey(getToday()),
      start,
      end: formatTimeFromMinutes(timeToMinutes(start) + 30),
      priority: "Medium",
      category: "Routine",
      project: linkedGoal ? getGoalMeta(linkedGoal).linkedProject : "Personal",
      goalId: linkedGoal?.id ?? null,
      habitId: habit.id,
      notes: `Habit block for ${habit.name}${linkedGoal ? ` supporting ${linkedGoal.label}` : ""}.`,
    });
  };

  const toggleTask = async (id) => {
    const task = tasks.find((item) => item.id === id);
    const willComplete = task ? !task.completed : false;
    setTasks((current) => current.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
    if (authUser && task) {
      const { error } = await updateUserRow("tasks", id, {
        status: willComplete ? "completed" : "scheduled",
        completed_at: willComplete ? new Date().toISOString() : null,
      });
      if (error) setWorkspaceError(error.message);
    }
    if (task && willComplete) {
      if (task.habitId) {
        const todayIndex = getHabitDayIndex();
        setHabits((current) =>
          current.map((habit) =>
            String(habit.id) === String(task.habitId)
              ? {
                  ...habit,
                  streak: habit.checks[todayIndex] ? habit.streak : habit.streak + 1,
                  checks: habit.checks.map((checked, index) => (index === todayIndex ? true : checked)),
                }
              : habit,
          ),
        );
      }
      setCheckIns((current) => [
        {
          id: Date.now(),
          when: "Just now",
          value: `Completed ${task.title}${task.linkedGoal ? ` for ${task.linkedGoal}` : ""}`,
          checkedInAt: new Date().toISOString(),
          focusMinutes: 0,
          taskId: task.id,
          linkedTask: task.title,
          goalId: task.goalId ?? null,
          linkedGoal: task.linkedGoal ?? "",
          habitId: task.habitId ?? null,
          linkedHabit: task.linkedHabit ?? "",
        },
        ...current,
      ]);
    }
  };

  const deleteTask = async (id) => {
    const nextTask = tasks.find((task) => task.id !== id);
    setTasks((current) => current.filter((task) => task.id !== id));
    setSelectedTaskId((currentId) => (currentId === id ? nextTask?.id ?? null : currentId));
    if (authUser) {
      const { error } = await deleteUserRow("tasks", id);
      if (error) setWorkspaceError(error.message);
    }
  };

  const saveViewerProfile = async ({ displayName }) => {
    const nextName = displayName.trim() || viewer.name;
    setViewer((current) => ({
      ...current,
      name: nextName,
      initials: getInitials(nextName, current.email),
    }));

    if (!authUser) return { ok: true };

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: authUser.id,
        display_name: nextName,
        onboarding_profile: onboardingProfile,
        theme,
        timezone,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) {
      setWorkspaceError(error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  };

  const saveViewerAvatar = async (file) => {
    const fileError = validateAvatarFile(file);
    if (fileError) return { ok: false, error: fileError };
    if (!authUser) return { ok: false, error: "Sign in to change your profile photo." };

    const uploadResult = await uploadAvatar({ userId: authUser.id, file, pathPrefix: "profile" });
    if (uploadResult.error) {
      setWorkspaceError(uploadResult.error.message);
      return { ok: false, error: uploadResult.error.message };
    }

    const avatarPath = uploadResult.data?.path ?? uploadResult.data?.fullPath?.replace(/^mark-avatars\//, "");
    if (!avatarPath) return { ok: false, error: "Could not save the uploaded photo path." };

    const avatarUrl = uploadResult.publicUrl || getAvatarPublicUrl(avatarPath);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: authUser.id,
        display_name: viewer.name === "there" ? null : viewer.name,
        avatar_path: avatarPath,
        onboarding_profile: onboardingProfile,
        theme,
        timezone,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) {
      setWorkspaceError(error.message);
      return { ok: false, error: error.message };
    }

    setViewer((current) => ({
      ...current,
      avatarPath,
      avatarUrl,
    }));

    return { ok: true };
  };

  const removeViewerAvatar = async () => {
    if (!authUser) return { ok: false, error: "Sign in to change your profile photo." };

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: authUser.id,
        display_name: viewer.name === "there" ? null : viewer.name,
        avatar_path: null,
        onboarding_profile: onboardingProfile,
        theme,
        timezone,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) {
      setWorkspaceError(error.message);
      return { ok: false, error: error.message };
    }

    setViewer((current) => ({
      ...current,
      avatarPath: "",
      avatarUrl: getUserMetadataAvatar(authUser),
    }));

    return { ok: true };
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleHabit = (habitId, dayIndex) => {
    const habit = habits.find((item) => item.id === habitId);
    const willComplete = habit ? !habit.checks[dayIndex] : false;
    setHabits((current) =>
      current.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              streak: habit.checks[dayIndex] || !willComplete ? habit.streak : habit.streak + 1,
              checks: habit.checks.map((checked, index) => (index === dayIndex ? !checked : checked)),
            }
          : habit,
      ),
    );
    if (habit && willComplete) {
      const linkedGoal = loopGoals.find((goal) => goal.label === habit.goal || String(goal.id) === String(habit.goalId));
      setCheckIns((current) => [
        {
          id: Date.now(),
          when: "Just now",
          value: `Checked ${habit.name}${linkedGoal ? ` for ${linkedGoal.label}` : ""}`,
          checkedInAt: new Date().toISOString(),
          focusMinutes: 0,
          habitId: habit.id,
          linkedHabit: habit.name,
          goalId: linkedGoal?.id ?? null,
          linkedGoal: linkedGoal?.label ?? "",
        },
        ...current,
      ]);
    }
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const toggleFocusTimer = () => {
    setFocusTimer((current) => {
      const { isComplete } = getFocusTimerMeta(current);
      if (isComplete) return current;
      return { ...current, running: !current.running };
    });
  };

  const resetFocusTimer = () => {
    setFocusTimer((current) => ({ ...current, running: false, elapsedSeconds: 0 }));
  };

  const setFocusTargetMinutes = (value) => {
    setFocusTimer((current) => ({
      ...current,
      running: false,
      elapsedSeconds: 0,
      targetMinutes: normalizeFocusTargetMinutes(value),
    }));
  };

  const endFocusSession = () => {
    const { elapsedMinutes, elapsedSeconds } = getFocusTimerMeta(focusTimer);
    if (!elapsedSeconds) return;

    setCheckIns((current) => [
      {
        id: Date.now(),
        when: "Just now",
        value: `${formatDuration(Math.max(1, elapsedMinutes))} focused`,
        checkedInAt: new Date().toISOString(),
        focusMinutes: Math.max(1, elapsedMinutes),
      },
      ...current,
    ]);
    setFocusTimer((current) => ({ ...current, running: false, elapsedSeconds: 0 }));
  };

  const navigateEntry = (view) => {
    const nextHash = getHashForRoute(view);
    if (window.location.hash === nextHash) {
      setEntryView(view);
    } else {
      window.location.hash = nextHash;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeOnboarding = (profileId) => {
    const nextWorkspace = buildOnboardingWorkspace(profileId);
    setTasks(nextWorkspace.tasks);
    setInbox(nextWorkspace.inbox);
    setGoals(nextWorkspace.goals);
    setHabits(nextWorkspace.habits);
    setReminders(nextWorkspace.reminders);
    setCheckIns(nextWorkspace.checkIns);
    setOnboardingProfile(profileId);
    setSelectedTaskId(nextWorkspace.tasks[0]?.id ?? null);
    setActiveNav("Overview");
    setFocusTimer((current) => ({ ...current, running: false, elapsedSeconds: 0 }));
    navigateEntry("app");
  };

  if (!appReady) {
    return <LoadingScreen theme={theme} isWorkspaceLoading={entryView === "app"} />;
  }

  if (entryView === "landing") {
    return <LandingPage onNavigate={navigateEntry} />;
  }

  if (entryView === "login" || entryView === "signup") {
    return <AuthPage mode={entryView} onNavigate={navigateEntry} theme={theme} />;
  }

  if (entryView === "onboarding") {
    return <OnboardingPage onNavigate={navigateEntry} onComplete={completeOnboarding} />;
  }

  if (entryView === "app" && isWorkspaceLoading) {
    return <LoadingScreen theme={theme} isWorkspaceLoading={entryView === "app" && isWorkspaceLoading} />;
  }

  return (
    <main className={`appShell ${theme === "dark" ? "darkTheme" : ""} ${isSidebarCollapsed ? "sidebarCollapsed" : ""}`}>
      {isSidebarCollapsed ? (
        <aside className="collapsedSidebarRail" aria-label="Collapsed sidebar">
          <img className="brandMark compact brandMarkImage" src={markLogoIconSrc} alt="" draggable="false" />
          <nav className="collapsedNav" aria-label="Primary">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={activeNav === item.label ? "active" : ""}
                  type="button"
                  aria-label={item.label}
                  title={item.label}
                  onClick={() => setActiveNav(item.label)}
                >
                  <Icon size={19} />
                </button>
              );
            })}
          </nav>
          <IconButton label="Show sidebar" className="sidebarRevealButton" onClick={() => setIsSidebarCollapsed(false)}>
            <PanelLeftOpen size={19} />
          </IconButton>
        </aside>
      ) : (
        <Sidebar
          goals={loopGoals}
          inbox={inbox}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onAddTask={() => openTaskDialog()}
          onAddGoal={() => setIsGoalDialogOpen(true)}
          onCollapse={() => setIsSidebarCollapsed(true)}
          viewer={viewer}
        />
      )}
      <section className={`mainSurface ${activeNav === "Calendar" ? "calendarMode" : ""}`}>
        {activeNav !== "Calendar" ? (
          <Header
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            tasks={tasks}
            goals={loopGoals}
            reminders={reminders}
            onAddTask={() => openTaskDialog()}
            theme={theme}
            onToggleTheme={toggleTheme}
            onSetTheme={setTheme}
            viewer={viewer}
            onSignOut={handleSignOut}
            onSaveProfile={saveViewerProfile}
            onSaveAvatar={saveViewerAvatar}
            onRemoveAvatar={removeViewerAvatar}
          />
        ) : null}
        {workspaceError ? <div className="workspaceNotice" role="alert">{workspaceError}</div> : null}
        <MainContent
          activeNav={activeNav}
          tasks={tasks}
          setTasks={setTasks}
          inbox={inbox}
          goals={loopGoals}
          habits={habits}
          reminders={reminders}
          setReminders={setReminders}
          checkIns={checkIns}
          setCheckIns={setCheckIns}
          selectedTaskId={selectedTaskId}
          setSelectedTaskId={setSelectedTaskId}
          stats={stats}
          onAddTask={() => openTaskDialog()}
          onAddGoal={() => setIsGoalDialogOpen(true)}
          onScheduleGoal={scheduleGoalTask}
          onScheduleHabit={scheduleHabitTask}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onToggleHabit={toggleHabit}
          theme={theme}
          onToggleTheme={toggleTheme}
          onSetTheme={setTheme}
          viewer={viewer}
          onSignOut={handleSignOut}
          onSaveProfile={saveViewerProfile}
          onSaveAvatar={saveViewerAvatar}
          onRemoveAvatar={removeViewerAvatar}
          focusTimer={focusTimer}
          onToggleFocusTimer={toggleFocusTimer}
          onResetFocusTimer={resetFocusTimer}
          onSetFocusTargetMinutes={setFocusTargetMinutes}
          onSelectFocusPreset={setFocusTargetMinutes}
          onEndFocusSession={endFocusSession}
        />
      </section>
      <ScheduleDialog open={isDialogOpen} onClose={closeTaskDialog} onCreate={createTask} goals={loopGoals} habits={habits} draft={taskDraft} />
      <GoalDialog open={isGoalDialogOpen} onClose={() => setIsGoalDialogOpen(false)} onCreate={createGoal} />
    </main>
  );
}
