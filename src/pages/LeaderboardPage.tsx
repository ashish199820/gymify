import { useEffect, useState } from 'react';
import { Calendar, Globe } from 'lucide-react';
import { RankRow } from '@/components/leaderboard/RankRow';
import { MuscleAnatomy } from '@/components/ui/MuscleAnatomy';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';
import { useUserStore } from '@/store/useUserStore';
import { useTrackingStore } from '@/store/useTrackingStore';
import { getLevelFromXP } from '@/lib/xpEngine';
import { getMuscleXPBreakdown } from '@/lib/progressUtils';
import type { MuscleGroup } from '@/lib/types';

export default function LeaderboardPage() {
  const { profile } = useUserStore();
  const sessions = useTrackingStore((s) => s.sessions);
  const { global, weekly, userRank, loadLeaderboard } = useLeaderboardStore();

  const [tab, setTab] = useState<'weekly' | 'global'>('weekly');

  useEffect(() => {
    if (profile) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weeklySessions = sessions.filter(
        (s) => new Date(s.startedAt) >= weekStart
      );
      const userWeeklyXP = weeklySessions.reduce((sum, s) => sum + s.xpEarned, 0);
      const currentLevel = getLevelFromXP(profile.totalXP);

      loadLeaderboard(
        profile.totalXP,
        userWeeklyXP,
        profile.username,
        profile.name,
        profile.id,
        profile.streak,
        currentLevel.level
      );
    }
  }, [profile, sessions, loadLeaderboard]);

  if (!profile) return null;

  const muscleXPBreakdown = getMuscleXPBreakdown(sessions);

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Leaderboards</h1>
        <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
          <span>Compete with other athletes based on weekly and global XP logs.</span>
        </p>
      </div>

      {/* Muscle Heatmap Card */}
      <div className="card-glass flex flex-col gap-4">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-white">Your Muscle Heatmap</h3>
          <p className="text-[11px] text-white/40 mt-0.5">Muscles turn green as you log exercises targeting them.</p>
        </div>
        <MuscleAnatomy muscleXP={muscleXPBreakdown} size="sm" />
        
        {/* Simple grid list of muscle XP */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          {Object.entries(muscleXPBreakdown).map(([muscle, xp]) => (
            <div key={muscle} className="bg-white/2 border border-white/5 rounded-xl p-2 text-center">
              <span className="text-[9px] text-white/40 uppercase font-semibold block truncate">
                {muscle.replace('_', ' ')}
              </span>
              <span className="text-xs font-black text-white mt-0.5">
                {xp} <span className="text-[8px] text-white/40">XP</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-100 p-1 rounded-2xl border border-white/5 shrink-0">
        <button
          onClick={() => setTab('weekly')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            tab === 'weekly'
              ? 'bg-white/5 border border-white/10 text-accent font-black shadow'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Weekly Score</span>
        </button>
        <button
          onClick={() => setTab('global')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            tab === 'global'
              ? 'bg-white/5 border border-white/10 text-accent font-black shadow'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>All-time Score</span>
        </button>
      </div>

      {/* Ranks list */}
      <div className="flex flex-col gap-3">
        <h3 className="section-title">
          {tab === 'weekly' ? 'Weekly Standings' : 'Global Ranks'}
        </h3>

        <div className="flex flex-col gap-3">
          {(tab === 'weekly' ? weekly : global).map((entry) => (
            <RankRow
              key={entry.userId}
              entry={entry}
              type={tab}
              isCurrentUser={entry.userId === profile.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
