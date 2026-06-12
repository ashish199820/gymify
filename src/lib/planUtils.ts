import type { WorkoutPlan, PlanDay, PlanExercise } from './types';

export function createPlan(name: string, description?: string): WorkoutPlan {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    description,
    createdAt: now,
    updatedAt: now,
    days: [],
  };
}

export function createPlanDay(label: string): PlanDay {
  return { id: crypto.randomUUID(), label, exercises: [] };
}

export function addExerciseToDay(
  day: PlanDay,
  exerciseId: string,
  defaults: Partial<Pick<PlanExercise, 'defaultSets' | 'defaultReps' | 'defaultWeightKg'>> = {}
): PlanDay {
  const ex: PlanExercise = {
    exerciseId,
    defaultSets: defaults.defaultSets ?? 3,
    defaultReps: defaults.defaultReps ?? 10,
    defaultWeightKg: defaults.defaultWeightKg ?? 0,
  };
  return { ...day, exercises: [...day.exercises, ex] };
}

export function removeExerciseFromDay(day: PlanDay, exerciseId: string): PlanDay {
  return { ...day, exercises: day.exercises.filter(e => e.exerciseId !== exerciseId) };
}

export function reorderExercises(day: PlanDay, from: number, to: number): PlanDay {
  const exercises = [...day.exercises];
  const [moved] = exercises.splice(from, 1);
  exercises.splice(to, 0, moved);
  return { ...day, exercises };
}

export function updatePlan(plan: WorkoutPlan, updates: Partial<Omit<WorkoutPlan, 'id' | 'createdAt'>>): WorkoutPlan {
  return { ...plan, ...updates, updatedAt: new Date().toISOString() };
}

export function getTotalExerciseCount(plan: WorkoutPlan): number {
  return plan.days.reduce((acc, d) => acc + d.exercises.length, 0);
}
