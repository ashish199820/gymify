import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@/lib/types';

interface UserStore {
  profile: UserProfile | null;
  isOnboarded: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addXP: (xp: number) => void;
  updateStreak: (streak: number) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isOnboarded: false,

      setProfile: (profile) => set({ profile, isOnboarded: true }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      addXP: (xp) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, totalXP: state.profile.totalXP + xp }
            : null,
        })),

      updateStreak: (streak) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                streak,
                longestStreak: Math.max(state.profile.longestStreak, streak),
              }
            : null,
        })),

      clearProfile: () => set({ profile: null, isOnboarded: false }),
    }),
    { name: 'gymflow-user' }
  )
);
