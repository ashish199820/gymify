import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkoutPlan } from '@/lib/types';
import { plansDB } from '@/lib/db';

interface PlanStore {
  plans: WorkoutPlan[];
  activePlanId: string | null;
  loaded: boolean;
  loadPlans: () => Promise<void>;
  savePlan: (plan: WorkoutPlan) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  setActivePlan: (id: string | null) => void;
}

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      plans: [],
      activePlanId: null,
      loaded: false,

      loadPlans: async () => {
        const plans = await plansDB.getAll();
        set({ plans, loaded: true });
      },

      savePlan: async (plan) => {
        await plansDB.save(plan);
        set((state) => ({
          plans: state.plans.find((p) => p.id === plan.id)
            ? state.plans.map((p) => (p.id === plan.id ? plan : p))
            : [...state.plans, plan],
        }));
      },

      deletePlan: async (id) => {
        await plansDB.delete(id);
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== id),
          activePlanId: state.activePlanId === id ? null : state.activePlanId,
        }));
      },

      setActivePlan: (id) => set({ activePlanId: id }),
    }),
    { name: 'gymflow-plans', partialize: (s) => ({ activePlanId: s.activePlanId }) }
  )
);
