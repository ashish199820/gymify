import { useNavigate } from 'react-router-dom';
import { Play, Calendar, Dumbbell, Trash2, Edit2 } from 'lucide-react';
import { usePlanStore } from '@/store/usePlanStore';
import { useTrackingStore } from '@/store/useTrackingStore';
import { getExerciseById } from '@/lib/exercises';
import type { WorkoutPlan } from '@/lib/types';

interface PlanCardProps {
  plan: WorkoutPlan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const navigate = useNavigate();
  const deletePlan = usePlanStore((s) => s.deletePlan);
  const startSession = useTrackingStore((s) => s.startSession);

  const totalExercises = plan.days.reduce((sum, d) => sum + d.exercises.length, 0);

  const handleStartWorkout = (dayId: string) => {
    const day = plan.days.find((d) => d.id === dayId);
    if (!day) return;

    // Map plan exercises to active tracking format
    const trackingExercises = day.exercises.map((pe) => ({
      exerciseId: pe.exerciseId,
      sets: Array.from({ length: pe.defaultSets }).map((_, i) => ({
        setNumber: i + 1,
        reps: pe.defaultReps,
        weightKg: pe.defaultWeightKg,
        completedAt: '',
      })),
    }));

    startSession(plan.id, day.id, trackingExercises);
    navigate('/track');
  };

  return (
    <div className="card-glass flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-bold text-lg leading-tight text-white">{plan.name}</h3>
          {plan.description && (
            <p className="text-xs text-white/50 mt-1 line-clamp-2">{plan.description}</p>
          )}
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => navigate(`/plans/edit/${plan.id}`)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Edit Plan"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this plan?')) deletePlan(plan.id);
            }}
            className="p-2 rounded-xl bg-danger/10 hover:bg-danger/25 text-danger transition-colors"
            aria-label="Delete Plan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="divider" />

      {/* Days & exercises lists */}
      {plan.days.length === 0 ? (
        <p className="text-xs text-white/40 text-center py-4">No workout days added yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {plan.days.map((day) => (
            <div key={day.id} className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-accent font-semibold text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{day.label}</span>
                </div>
                <button
                  onClick={() => handleStartWorkout(day.id)}
                  className="flex items-center gap-1 bg-accent hover:shadow-glow-green text-black font-bold text-xs px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start</span>
                </button>
              </div>

              {/* Day exercise list preview */}
              <div className="flex flex-col gap-1.5 mt-1">
                {day.exercises.slice(0, 4).map((pe, idx) => {
                  const details = getExerciseById(pe.exerciseId);
                  return (
                    <div key={idx} className="flex justify-between text-xs text-white/70">
                      <span className="truncate max-w-[200px]">{details?.name || 'Exercise'}</span>
                      <span className="text-white/40 shrink-0">
                        {pe.defaultSets}×{pe.defaultReps} @ {pe.defaultWeightKg}kg
                      </span>
                    </div>
                  );
                })}
                {day.exercises.length > 4 && (
                  <p className="text-[10px] text-white/40">
                    + {day.exercises.length - 4} more exercises
                  </p>
                )}
                {day.exercises.length === 0 && (
                  <p className="text-[10px] text-white/40 italic">Empty. Add exercises in Edit mode.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
