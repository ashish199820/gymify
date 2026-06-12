import type { WorkoutSession, SessionExercise, WorkoutSet, MuscleGroup } from './types';
import { getExerciseById } from './exercises';
import { calcSetXP } from './xpEngine';

export interface ExerciseProgress {
  exerciseId: string;
  sessions: {
    date: string;
    maxWeight: number;
    totalVolume: number;
    totalReps: number;
    sets: number;
  }[];
}

export function getExerciseProgress(
  sessions: WorkoutSession[],
  exerciseId: string
): ExerciseProgress {
  const result: ExerciseProgress = { exerciseId, sessions: [] };

  for (const session of sessions) {
    const ex = session.exercises.find(e => e.exerciseId === exerciseId);
    if (!ex || ex.skipped) continue;

    const workingSets = ex.sets.filter(s => !s.isWarmup);
    if (workingSets.length === 0) continue;

    result.sessions.push({
      date: session.startedAt,
      maxWeight: Math.max(...workingSets.map(s => s.weightKg)),
      totalVolume: workingSets.reduce((sum, s) => sum + s.weightKg * s.reps, 0),
      totalReps: workingSets.reduce((sum, s) => sum + s.reps, 0),
      sets: workingSets.length,
    });
  }

  return result;
}

export function getTotalVolume(session: WorkoutSession): number {
  return session.exercises
    .filter(e => !e.skipped)
    .flatMap(e => e.sets.filter(s => !s.isWarmup))
    .reduce((sum, s) => sum + s.weightKg * s.reps, 0);
}

export function getPersonalBest(
  sessions: WorkoutSession[],
  exerciseId: string
): WorkoutSet | null {
  let best: WorkoutSet | null = null;

  for (const session of sessions) {
    const ex = session.exercises.find(e => e.exerciseId === exerciseId);
    if (!ex || ex.skipped) continue;

    for (const set of ex.sets.filter(s => !s.isWarmup)) {
      if (!best || set.weightKg > best.weightKg) {
        best = set;
      }
    }
  }

  return best;
}

export function getWeeklyVolume(sessions: WorkoutSession[]): number {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  return sessions
    .filter(s => new Date(s.startedAt) >= weekStart)
    .reduce((sum, s) => sum + getTotalVolume(s), 0);
}

export function getMuscleXPBreakdown(sessions: WorkoutSession[]): Record<MuscleGroup, number> {
  const breakdown: Record<MuscleGroup, number> = {
    chest: 0,
    back: 0,
    shoulder: 0,
    biceps: 0,
    triceps: 0,
    core_abs: 0,
    upper_leg: 0,
    lower_leg: 0,
    glutes: 0,
  };

  for (const session of sessions) {
    for (const ex of session.exercises) {
      if (ex.skipped) continue;
      const details = getExerciseById(ex.exerciseId);
      if (!details) continue;

      let exerciseXP = 0;
      for (const set of ex.sets) {
        if (set.isWarmup) continue;
        exerciseXP += calcSetXP(set.weightKg, set.reps);
      }

      const mg = details.muscleGroup;
      if (mg in breakdown) {
        breakdown[mg] += Math.round(exerciseXP);
      }
    }
  }

  return breakdown;
}
