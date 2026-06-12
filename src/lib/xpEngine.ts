import type { WorkoutSession, UserProfile, XPBreakdown, XPLevel } from './types';

// ─── XP Levels ───────────────────────────────────────────────────────────────
export const XP_LEVELS: XPLevel[] = [
  { level: 1, title: 'Rookie',      minXP: 0,     maxXP: 499,   color: '#6b7280' },
  { level: 2, title: 'Trainee',     minXP: 500,   maxXP: 1499,  color: '#3b82f6' },
  { level: 3, title: 'Challenger',  minXP: 1500,  maxXP: 3499,  color: '#8b5cf6' },
  { level: 4, title: 'Athlete',     minXP: 3500,  maxXP: 6999,  color: '#f59e0b' },
  { level: 5, title: 'Warrior',     minXP: 7000,  maxXP: 11999, color: '#ef4444' },
  { level: 6, title: 'Champion',    minXP: 12000, maxXP: 19999, color: '#a3e635' },
  { level: 7, title: 'Elite',       minXP: 20000, maxXP: 29999, color: '#06b6d4' },
  { level: 8, title: 'Legend',      minXP: 30000, maxXP: Infinity, color: '#f97316' },
];

// ─── Core formula ────────────────────────────────────────────────────────────
/**
 * XP per set = weight_kg × reps × 0.1
 * Cap per set at 50 XP to prevent extreme weight gaming.
 */
export function calcSetXP(weightKg: number, reps: number): number {
  return Math.min(weightKg * reps * 0.1, 50);
}

/**
 * Consistency multiplier based on current streak.
 * 1.0 base → up to 2.0 at 20+ day streak.
 */
export function calcConsistencyMultiplier(streakDays: number): number {
  return Math.min(1 + streakDays * 0.05, 2.0);
}

/**
 * Weekly regularity bonus — awarded if user completed 3+ sessions this week.
 */
export function calcWeeklyBonus(sessionsThisWeek: number): number {
  if (sessionsThisWeek >= 5) return 100;
  if (sessionsThisWeek >= 3) return 50;
  return 0;
}

/**
 * Calculate total XP for a completed workout session.
 */
export function calcSessionXP(
  session: Pick<WorkoutSession, 'exercises'>,
  streakDays: number,
  sessionsThisWeek: number
): XPBreakdown {
  let baseXP = 0;

  for (const ex of session.exercises) {
    if (ex.skipped) continue;
    for (const set of ex.sets) {
      if (set.isWarmup) continue;
      baseXP += calcSetXP(set.weightKg, set.reps);
    }
  }

  const multiplier = calcConsistencyMultiplier(streakDays);
  const consistencyBonus = Math.round(baseXP * (multiplier - 1));
  const weeklyBonus = calcWeeklyBonus(sessionsThisWeek);
  const total = Math.round(baseXP + consistencyBonus + weeklyBonus);

  return { baseXP: Math.round(baseXP), consistencyBonus, weeklyBonus, total, streak: streakDays, multiplier };
}

// ─── Level helpers ───────────────────────────────────────────────────────────
export function getLevelFromXP(totalXP: number): XPLevel {
  return XP_LEVELS.slice().reverse().find(l => totalXP >= l.minXP) ?? XP_LEVELS[0];
}

export function getProgressToNextLevel(totalXP: number): number {
  const level = getLevelFromXP(totalXP);
  if (level.maxXP === Infinity) return 1;
  const range = level.maxXP - level.minXP;
  const progress = totalXP - level.minXP;
  return Math.min(progress / range, 1);
}

export function getXPToNextLevel(totalXP: number): number {
  const level = getLevelFromXP(totalXP);
  if (level.maxXP === Infinity) return 0;
  return level.maxXP - totalXP;
}

// ─── Streak helpers ───────────────────────────────────────────────────────────
export function calcStreak(sessionDates: string[]): number {
  if (sessionDates.length === 0) return 0;

  const sorted = [...sessionDates]
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let current = today;

  for (const date of sorted) {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    const diff = Math.round((current.getTime() - day.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0 || diff === 1) {
      streak++;
      current = day;
    } else {
      break;
    }
  }

  return streak;
}

export function getSessionsThisWeek(sessions: { startedAt: string }[]): number {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);
  return sessions.filter(s => new Date(s.startedAt) >= weekStart).length;
}
