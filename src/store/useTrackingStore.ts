import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkoutSession, SessionExercise, WorkoutSet } from '@/lib/types';
import { sessionsDB } from '@/lib/db';

interface ActiveSession {
  session: WorkoutSession;
  currentExerciseIndex: number;
  startTime: number;
}

interface TrackingStore {
  sessions: WorkoutSession[];
  activeSession: ActiveSession | null;
  loaded: boolean;
  loadSessions: () => Promise<void>;
  startSession: (planId: string, dayId: string, exercises: SessionExercise[]) => void;
  addSet: (exerciseIndex: number, set: Omit<WorkoutSet, 'setNumber' | 'completedAt'>) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  updateSet: (exerciseIndex: number, setIndex: number, updates: Partial<WorkoutSet>) => void;
  setCurrentExercise: (index: number) => void;
  completeSession: (xpEarned: number) => Promise<WorkoutSession | null>;
  cancelSession: () => void;
  deleteSession: (id: string) => Promise<void>;
}

export const useTrackingStore = create<TrackingStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSession: null,
      loaded: false,

      loadSessions: async () => {
        const sessions = await sessionsDB.getAll();
        sessions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
        set({ sessions, loaded: true });
      },

      startSession: (planId, dayId, exercises) => {
        const session: WorkoutSession = {
          id: crypto.randomUUID(),
          planId,
          dayId,
          startedAt: new Date().toISOString(),
          xpEarned: 0,
          exercises,
        };
        set({ activeSession: { session, currentExerciseIndex: 0, startTime: Date.now() } });
      },

      addSet: (exerciseIndex, setData) =>
        set((state) => {
          if (!state.activeSession) return state;
          const exercises = [...state.activeSession.session.exercises];
          const ex = { ...exercises[exerciseIndex] };
          const sets = [...ex.sets];
          sets.push({
            ...setData,
            setNumber: sets.length + 1,
            completedAt: new Date().toISOString(),
          });
          ex.sets = sets;
          exercises[exerciseIndex] = ex;
          return {
            activeSession: {
              ...state.activeSession,
              session: { ...state.activeSession.session, exercises },
            },
          };
        }),

      removeSet: (exerciseIndex, setIndex) =>
        set((state) => {
          if (!state.activeSession) return state;
          const exercises = [...state.activeSession.session.exercises];
          const ex = { ...exercises[exerciseIndex] };
          ex.sets = ex.sets.filter((_, i) => i !== setIndex);
          exercises[exerciseIndex] = ex;
          return {
            activeSession: {
              ...state.activeSession,
              session: { ...state.activeSession.session, exercises },
            },
          };
        }),

      updateSet: (exerciseIndex, setIndex, updates) =>
        set((state) => {
          if (!state.activeSession) return state;
          const exercises = [...state.activeSession.session.exercises];
          const ex = { ...exercises[exerciseIndex] };
          ex.sets = ex.sets.map((s, i) => (i === setIndex ? { ...s, ...updates } : s));
          exercises[exerciseIndex] = ex;
          return {
            activeSession: {
              ...state.activeSession,
              session: { ...state.activeSession.session, exercises },
            },
          };
        }),

      setCurrentExercise: (index) =>
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, currentExerciseIndex: index }
            : null,
        })),

      completeSession: async (xpEarned) => {
        const { activeSession } = get();
        if (!activeSession) return null;
        const completed: WorkoutSession = {
          ...activeSession.session,
          completedAt: new Date().toISOString(),
          durationSeconds: Math.round((Date.now() - activeSession.startTime) / 1000),
          xpEarned,
        };
        await sessionsDB.save(completed);
        set((state) => ({
          sessions: [completed, ...state.sessions],
          activeSession: null,
        }));
        return completed;
      },

      cancelSession: () => set({ activeSession: null }),

      deleteSession: async (id) => {
        await sessionsDB.delete(id);
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) }));
      },
    }),
    {
      name: 'gymflow-tracking',
      partialize: (s) => ({ activeSession: s.activeSession }),
    }
  )
);
