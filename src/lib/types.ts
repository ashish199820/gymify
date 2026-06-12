// ─── Muscle Groups ───────────────────────────────────────────────────────────
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'biceps'
  | 'triceps'
  | 'shoulder'
  | 'core_abs'
  | 'upper_leg'
  | 'lower_leg'
  | 'glutes';

export type MovementMechanics = 'Compound' | 'Isolation' | 'Mobility / Stretch';

export type Gender = 'male' | 'female' | 'other';

export type FitnessGoal =
  | 'strength'
  | 'hypertrophy'
  | 'endurance'
  | 'weight_loss'
  | 'general_fitness';

// ─── Exercise ────────────────────────────────────────────────────────────────
export interface TutorialStep {
  step: number;
  title: string;
  description: string;
  tip?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  primaryMuscles: string;
  secondaryMuscles: string;
  equipment: string;
  mechanics: MovementMechanics;
  tutorial: TutorialStep[];
}

// ─── Plan ────────────────────────────────────────────────────────────────────
export interface PlanExercise {
  exerciseId: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeightKg: number;
  notes?: string;
}

export interface PlanDay {
  id: string;
  label: string; // e.g. 'Day 1 – Push'
  exercises: PlanExercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  days: PlanDay[];
}

// ─── Tracking ────────────────────────────────────────────────────────────────
export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  completedAt: string;
  isWarmup?: boolean;
}

export interface SessionExercise {
  exerciseId: string;
  sets: WorkoutSet[];
  notes?: string;
  skipped?: boolean;
}

export interface WorkoutSession {
  id: string;
  planId: string;
  dayId: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  xpEarned: number;
  exercises: SessionExercise[];
  notes?: string;
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  name: string;
  username: string;
  heightCm: number;
  weightKg: number;
  gender: Gender;
  goal: FitnessGoal;
  totalXP: number;
  streak: number;
  longestStreak: number;
  joinedAt: string;
  lastSessionAt?: string;
  avatarUrl?: string;
}

// ─── XP ──────────────────────────────────────────────────────────────────────
export interface XPBreakdown {
  baseXP: number;
  consistencyBonus: number;
  weeklyBonus: number;
  total: number;
  streak: number;
  multiplier: number;
}

export interface XPLevel {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  userId: string;
  username: string;
  name: string;
  totalXP: number;
  weeklyXP: number;
  streak: number;
  level: number;
  avatarUrl?: string;
  rank: number;
}
