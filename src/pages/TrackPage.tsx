import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { Play, Flame, Calendar, Trophy, BarChart2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { WorkoutLogger } from '@/components/tracking/WorkoutLogger';
import { useTrackingStore } from '@/store/useTrackingStore';
import { useUserStore } from '@/store/useUserStore';
import { getExerciseById } from '@/lib/exercises';
import { calcStreak, getSessionsThisWeek } from '@/lib/xpEngine';

export default function TrackPage() {
  const navigate = useNavigate();
  const { activeSession, sessions, loaded, loadSessions, completeSession, cancelSession } = useTrackingStore();
  const { profile, addXP, updateStreak } = useUserStore();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleWorkoutComplete = async (xpEarned: number) => {
    const completed = await completeSession(xpEarned);
    if (completed && profile) {
      // Add XP
      addXP(xpEarned);

      // Recalculate streak
      const allSessionDates = [
        completed.startedAt,
        ...sessions.map((s) => s.startedAt),
      ];
      const streak = calcStreak(allSessionDates);
      updateStreak(streak);

      alert(`🏋️ Workout complete! You earned ${xpEarned} XP.`);
    }
  };

  const handleWorkoutCancel = () => {
    if (confirm('Cancel this active workout? All current progress will be lost.')) {
      cancelSession();
    }
  };

  // If there's an active session, render the interactive workout logger!
  if (activeSession) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden px-4 pt-4 pb-20">
        <WorkoutLogger onComplete={handleWorkoutComplete} onCancel={handleWorkoutCancel} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Workout Tracking</h1>
        <p className="text-xs text-white/40 mt-1">
          Monitor your consistency, review past workout volume, and log training days.
        </p>
      </div>

      {/* No Active Workout Box */}
      <div className="card-glass text-center p-5 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
          <Play className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">No Active Workout</h3>
          <p className="text-xs text-white/40 max-w-xs mt-1">
            To start logging weight and repetitions, pick a workout plan and day split.
          </p>
        </div>
        <Button onClick={() => navigate('/plans')} variant="primary" className="py-2 px-6 mt-1 text-xs">
          Start Workout Split
        </Button>
      </div>

      {/* Workout History */}
      <div className="flex flex-col gap-3">
        <h3 className="section-title">Workout History</h3>

        {!loaded ? (
          <div className="flex justify-center py-10">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-10 bg-white/3 border border-white/5 border-dashed rounded-2xl text-white/40 text-xs">
            No tracked sessions yet. Complete your first workout to log consistency!
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {sessions.map((sess) => {
              const dateObj = new Date(sess.startedAt);
              const durationMins = sess.durationSeconds ? Math.round(sess.durationSeconds / 60) : 0;
              const totalSets = sess.exercises.reduce((sum, e) => sum + e.sets.length, 0);

              return (
                <div key={sess.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        {format(dateObj, 'eeee, MMMM d')}
                      </h4>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        Started {formatDistanceToNow(dateObj, { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant="lime" className="font-bold text-xs py-1 px-2.5">
                      +{sess.xpEarned} XP
                    </Badge>
                  </div>

                  <div className="divider my-0" />

                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-white/30" />
                      <span>{durationMins} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart2 className="w-3.5 h-3.5 text-white/30" />
                      <span>{totalSets} Sets logged</span>
                    </div>
                  </div>

                  {/* Summary of exercises */}
                  <div className="flex flex-col gap-1 mt-1 bg-white/2 p-2.5 rounded-xl border border-white/5">
                    {sess.exercises.map((se, idx) => {
                      const details = getExerciseById(se.exerciseId);
                      return (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-white/80 truncate max-w-[220px]">
                            {details?.name || 'Exercise'}
                          </span>
                          <span className="text-white/40">
                            {se.sets.length} sets
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
