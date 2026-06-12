import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, HelpCircle, Trophy, CheckSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SetRow } from './SetRow';
import { TutorialModal } from '../exercises/TutorialModal';
import { getExerciseById } from '@/lib/exercises';
import { useTrackingStore } from '@/store/useTrackingStore';
import { useUserStore } from '@/store/useUserStore';
import { calcSessionXP } from '@/lib/xpEngine';
import type { WorkoutSession, SessionExercise } from '@/lib/types';

interface WorkoutLoggerProps {
  onComplete: (xpEarned: number) => void;
  onCancel: () => void;
}

export function WorkoutLogger({ onComplete, onCancel }: WorkoutLoggerProps) {
  const activeSession = useTrackingStore((s) => s.activeSession);
  const addSet = useTrackingStore((s) => s.addSet);
  const removeSet = useTrackingStore((s) => s.removeSet);
  const updateSet = useTrackingStore((s) => s.updateSet);
  const setCurrentExercise = useTrackingStore((s) => s.setCurrentExercise);
  const trackingSessions = useTrackingStore((s) => s.sessions);
  const user = useUserStore((s) => s.profile);

  const [showTutorial, setShowTutorial] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Safeguard if activeSession is null
  if (!activeSession) return null;

  const { session, currentExerciseIndex, startTime } = activeSession;
  const currentEx = session.exercises[currentExerciseIndex];
  const exerciseDetails = getExerciseById(currentEx.exerciseId);

  // Format Elapsed Timer
  useEffect(() => {
    setElapsed(Math.round((Date.now() - startTime) / 1000));
    const interval = setInterval(() => {
      setElapsed(Math.round((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddSet = () => {
    // Duplicate values of the last set, if it exists
    const lastSet = currentEx.sets[currentEx.sets.length - 1];
    addSet(currentExerciseIndex, {
      reps: lastSet?.reps ?? 10,
      weightKg: lastSet?.weightKg ?? 0,
    });
  };

  // Live session XP estimate
  const currentEstimatedXP = () => {
    const streak = user?.streak ?? 0;
    const weeklySessionsCount = trackingSessions.filter((s) => {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay());
      return new Date(s.startedAt) >= start;
    }).length;
    const breakdown = calcSessionXP(session, streak, weeklySessionsCount + 1);
    return breakdown.total;
  };

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Session Timer & XP Estimate Header */}
      <div className="card-glass flex justify-between items-center p-3 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Active Session</span>
          <span className="text-xl font-bold tracking-tight text-white">{formatTime(elapsed)}</span>
        </div>
        <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-xl px-3 py-1.5">
          <Trophy className="w-4.5 h-4.5 text-accent animate-bounce" />
          <div className="flex flex-col align-start">
            <span className="text-[9px] text-accent font-bold uppercase tracking-wider">Estimated XP</span>
            <span className="text-sm font-black text-white">{currentEstimatedXP()} XP</span>
          </div>
        </div>
      </div>

      {/* Exercises Tabs Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hidden touch-pan-x shrink-0">
        {session.exercises.map((se, idx) => {
          const det = getExerciseById(se.exerciseId);
          const isSelected = idx === currentExerciseIndex;
          const isCompleted = se.sets.length > 0 && se.sets.every((s) => !!s.completedAt);
          return (
            <button
              key={idx}
              onClick={() => setCurrentExercise(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-accent border-accent text-black shadow-glow-green'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {isCompleted && (
                <CheckSquare className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{det?.name || `Exercise ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {/* Main active exercise log area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4">
        {exerciseDetails && (
          <div className="card-glass flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="font-bold text-lg text-white leading-tight">
                  {exerciseDetails.name}
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  Primary: {exerciseDetails.primaryMuscles} • Mechanics: {exerciseDetails.mechanics}
                </p>
              </div>
              <button
                onClick={() => setShowTutorial(true)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0"
                aria-label="View tutorial"
              >
                <HelpCircle className="w-4 h-4 text-accent" />
              </button>
            </div>

            <div className="divider my-1" />

            {/* Sets log container */}
            <div className="flex flex-col gap-2.5">
              {currentEx.sets.length === 0 ? (
                <p className="text-xs text-white/40 text-center py-6">
                  No sets logged. Add a set to start tracking!
                </p>
              ) : (
                currentEx.sets.map((set, sIdx) => (
                  <SetRow
                    key={sIdx}
                    set={set}
                    index={sIdx}
                    onUpdate={(updates) => updateSet(currentExerciseIndex, sIdx, updates)}
                    onRemove={() => removeSet(currentExerciseIndex, sIdx)}
                  />
                ))
              )}

              <button
                onClick={handleAddSet}
                className="flex items-center justify-center gap-1 border border-white/5 border-dashed hover:border-accent/40 rounded-xl py-3 text-xs font-semibold text-white/50 hover:text-accent transition-all mt-1 bg-white/2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Set</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination controls & Complete session sticky footer */}
      <div className="p-4 bg-surface-50 border-t border-white/5 rounded-2xl flex flex-col gap-3 shrink-0">
        <div className="flex justify-between gap-3">
          <Button
            variant="secondary"
            disabled={currentExerciseIndex === 0}
            onClick={() => setCurrentExercise(currentExerciseIndex - 1)}
            fullWidth
            className="flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </Button>

          <Button
            variant="secondary"
            disabled={currentExerciseIndex === session.exercises.length - 1}
            onClick={() => setCurrentExercise(currentExerciseIndex + 1)}
            fullWidth
            className="flex items-center justify-center gap-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-3 mt-1">
          <Button variant="danger" onClick={onCancel} className="w-1/3">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onComplete(currentEstimatedXP())} className="w-2/3">
            Finish Workout
          </Button>
        </div>
      </div>

      {exerciseDetails && (
        <TutorialModal
          exercise={exerciseDetails}
          open={showTutorial}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}
