import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { ExercisePicker } from '../exercises/ExercisePicker';
import { getExerciseById } from '@/lib/exercises';
import { usePlanStore } from '@/store/usePlanStore';
import { createPlan, createPlanDay, addExerciseToDay, removeExerciseFromDay } from '@/lib/planUtils';
import type { WorkoutPlan, PlanDay, PlanExercise } from '@/lib/types';

interface PlanBuilderProps {
  initialPlan?: WorkoutPlan;
}

export function PlanBuilder({ initialPlan }: PlanBuilderProps) {
  const navigate = useNavigate();
  const savePlan = usePlanStore((s) => s.savePlan);

  const [name, setName] = useState(initialPlan?.name ?? '');
  const [description, setDescription] = useState(initialPlan?.description ?? '');
  const [days, setDays] = useState<PlanDay[]>(initialPlan?.days ?? []);

  // Exercise picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);

  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const newDay = createPlanDay(`Day ${nextDayNum} - Push/Pull`);
    setDays([...days, newDay]);
  };

  const handleRemoveDay = (id: string) => {
    setDays(days.filter((d) => d.id !== id));
  };

  const handleUpdateDayLabel = (id: string, label: string) => {
    setDays(days.map((d) => (d.id === id ? { ...d, label } : d)));
  };

  const handleOpenPicker = (dayId: string) => {
    setActiveDayId(dayId);
    setPickerOpen(true);
  };

  const handleExercisesSelected = (selected: any[]) => {
    if (!activeDayId) return;

    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.id !== activeDayId) return d;

        // Merge selected without duplicating existing
        let updatedExercises = [...d.exercises];
        selected.forEach((ex) => {
          if (!updatedExercises.some((pe) => pe.exerciseId === ex.id)) {
            updatedExercises.push({
              exerciseId: ex.id,
              defaultSets: 3,
              defaultReps: 10,
              defaultWeightKg: 0,
            });
          }
        });

        return { ...d, exercises: updatedExercises };
      })
    );
    setActiveDayId(null);
  };

  const handleUpdateExerciseDefaults = (
    dayId: string,
    exerciseId: string,
    field: keyof PlanExercise,
    val: number
  ) => {
    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.id !== dayId) return d;
        return {
          ...d,
          exercises: d.exercises.map((pe) =>
            pe.exerciseId === exerciseId ? { ...pe, [field]: val } : pe
          ),
        };
      })
    );
  };

  const handleRemoveExercise = (dayId: string, exerciseId: string) => {
    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.id !== dayId) return d;
        return removeExerciseFromDay(d, exerciseId);
      })
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a name for the plan.');
      return;
    }

    const planData: WorkoutPlan = {
      id: initialPlan?.id ?? crypto.randomUUID(),
      name,
      description,
      createdAt: initialPlan?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      days,
    };

    await savePlan(planData);
    navigate('/plans');
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
      {/* Name and description */}
      <div className="flex flex-col gap-4">
        <Input
          label="Plan Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Hypertrophy Split, Strength 5x5"
        />
        <Input
          label="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Focus on chest and arms hypertrophy"
        />
      </div>

      <div className="divider" />

      {/* Days builder */}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="section-title mb-0">Workout Days</h3>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAddDay}
            className="flex items-center gap-1 py-1 px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Day</span>
          </Button>
        </div>

        {days.length === 0 ? (
          <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/5 border-dashed text-white/40">
            No workout days yet. Click Add Day to start structuring your plan.
          </div>
        ) : (
          days.map((day, dIdx) => (
            <div key={day.id} className="card-glass flex flex-col gap-4 relative">
              {/* Day Header */}
              <div className="flex justify-between items-center gap-3">
                <input
                  value={day.label}
                  onChange={(e) => handleUpdateDayLabel(day.id, e.target.value)}
                  className="bg-transparent border-b border-transparent focus:border-accent font-semibold text-white focus:outline-none w-full text-base"
                  placeholder="Day Label"
                />
                <button
                  onClick={() => handleRemoveDay(day.id)}
                  className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors shrink-0"
                  aria-label="Remove Day"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="divider my-1" />

              {/* Day Exercises List */}
              <div className="flex flex-col gap-3">
                {day.exercises.map((pe, pIdx) => {
                  const details = getExerciseById(pe.exerciseId);
                  return (
                    <div
                      key={pe.exerciseId}
                      className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-sm text-white/95">
                            {details?.name || 'Exercise'}
                          </h4>
                          <span className="text-[10px] text-white/40">
                            {details?.primaryMuscles} • {details?.equipment}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveExercise(day.id, pe.exerciseId)}
                          className="text-white/40 hover:text-danger transition-colors"
                          aria-label="Remove exercise"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Reps/Sets config */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider block mb-1">Sets</span>
                          <input
                            type="number"
                            value={pe.defaultSets}
                            onChange={(e) =>
                              handleUpdateExerciseDefaults(
                                day.id,
                                pe.exerciseId,
                                'defaultSets',
                                Math.max(1, parseInt(e.target.value) || 1)
                              )
                            }
                            className="bg-surface-100 border border-white/10 rounded-lg px-2 py-1.5 text-center text-xs text-white focus:outline-none focus:border-accent w-full"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider block mb-1">Reps</span>
                          <input
                            type="number"
                            value={pe.defaultReps}
                            onChange={(e) =>
                              handleUpdateExerciseDefaults(
                                day.id,
                                pe.exerciseId,
                                'defaultReps',
                                Math.max(1, parseInt(e.target.value) || 1)
                              )
                            }
                            className="bg-surface-100 border border-white/10 rounded-lg px-2 py-1.5 text-center text-xs text-white focus:outline-none focus:border-accent w-full"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider block mb-1">Weight (kg)</span>
                          <input
                            type="number"
                            value={pe.defaultWeightKg}
                            onChange={(e) =>
                              handleUpdateExerciseDefaults(
                                day.id,
                                pe.exerciseId,
                                'defaultWeightKg',
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            }
                            className="bg-surface-100 border border-white/10 rounded-lg px-2 py-1.5 text-center text-xs text-white focus:outline-none focus:border-accent w-full"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => handleOpenPicker(day.id)}
                  className="flex items-center justify-center gap-1.5 border border-white/5 border-dashed hover:border-accent/40 rounded-xl py-3 text-xs font-semibold text-white/50 hover:text-accent transition-all mt-1 bg-white/2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Exercise</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-3 mt-4">
        <Button variant="secondary" onClick={() => navigate('/plans')} fullWidth>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} fullWidth>
          Save Plan
        </Button>
      </div>

      {pickerOpen && activeDayId && (
        <ExercisePicker
          open={pickerOpen}
          onClose={() => {
            setPickerOpen(false);
            setActiveDayId(null);
          }}
          initialSelectedIds={days.find((d) => d.id === activeDayId)?.exercises.map((e) => e.exerciseId)}
          onSelect={handleExercisesSelected}
        />
      )}
    </div>
  );
}
