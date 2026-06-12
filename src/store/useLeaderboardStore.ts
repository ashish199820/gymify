import { create } from 'zustand';
import type { LeaderboardEntry } from '@/lib/types';

const MOCK_GLOBAL: LeaderboardEntry[] = [
  { userId: 'u1', username: 'ironmike', name: 'Mike Tyson', totalXP: 28500, weeklyXP: 1200, streak: 45, level: 7, rank: 1 },
  { userId: 'u2', username: 'fitjessica', name: 'Jessica A.', totalXP: 22100, weeklyXP: 980, streak: 32, level: 7, rank: 2 },
  { userId: 'u3', username: 'liftking', name: 'David K.', totalXP: 18700, weeklyXP: 1450, streak: 21, level: 6, rank: 3 },
  { userId: 'u4', username: 'cardio_q', name: 'Quinn R.', totalXP: 15200, weeklyXP: 670, streak: 18, level: 6, rank: 4 },
  { userId: 'u5', username: 'beastmode', name: 'Alex T.', totalXP: 12800, weeklyXP: 890, streak: 14, level: 6, rank: 5 },
  { userId: 'u6', username: 'gain_train', name: 'Sam L.', totalXP: 9400, weeklyXP: 540, streak: 10, level: 5, rank: 6 },
  { userId: 'u7', username: 'prgrind', name: 'Priya S.', totalXP: 7100, weeklyXP: 320, streak: 8, level: 4, rank: 7 },
  { userId: 'u8', username: 'flexmax', name: 'Max B.', totalXP: 4300, weeklyXP: 210, streak: 5, level: 3, rank: 8 },
];

interface LeaderboardStore {
  global: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  userRank: { global: number; weekly: number } | null;
  loadLeaderboard: (userXP: number, weeklyXP: number, username: string, name: string, userId: string, streak: number, level: number) => void;
}

export const useLeaderboardStore = create<LeaderboardStore>()((set) => ({
  global: MOCK_GLOBAL,
  weekly: [...MOCK_GLOBAL].sort((a, b) => b.weeklyXP - a.weeklyXP).map((e, i) => ({ ...e, rank: i + 1 })),
  userRank: null,

  loadLeaderboard: (userXP, weeklyXP, username, name, userId, streak, level) => {
    const userEntry: LeaderboardEntry = { userId, username, name, totalXP: userXP, weeklyXP, streak, level, rank: 0 };

    const globalEntries = [...MOCK_GLOBAL.filter(e => e.userId !== userId), userEntry]
      .sort((a, b) => b.totalXP - a.totalXP)
      .map((e, i) => ({ ...e, rank: i + 1 }));

    const weeklyEntries = [...MOCK_GLOBAL.filter(e => e.userId !== userId), userEntry]
      .sort((a, b) => b.weeklyXP - a.weeklyXP)
      .map((e, i) => ({ ...e, rank: i + 1 }));

    const userRankGlobal = globalEntries.find(e => e.userId === userId)?.rank ?? 0;
    const userRankWeekly = weeklyEntries.find(e => e.userId === userId)?.rank ?? 0;

    set({
      global: globalEntries,
      weekly: weeklyEntries,
      userRank: { global: userRankGlobal, weekly: userRankWeekly },
    });
  },
}));
