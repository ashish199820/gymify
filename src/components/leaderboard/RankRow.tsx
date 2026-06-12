import { Trophy, Flame } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { getLevelFromXP } from '@/lib/xpEngine';
import type { LeaderboardEntry } from '@/lib/types';

interface RankRowProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  type: 'global' | 'weekly';
}

export function RankRow({ entry, isCurrentUser, type }: RankRowProps) {
  const levelDetails = getLevelFromXP(entry.totalXP);

  // Styling for top 3
  const rankColors: Record<number, string> = {
    1: 'bg-yellow-400 text-black font-black',
    2: 'bg-slate-300 text-black font-black',
    3: 'bg-amber-600 text-white font-black',
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-3 border transition-all ${
        isCurrentUser
          ? 'bg-accent/10 border-accent/40 shadow-glow-green ring-1 ring-accent/20'
          : 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10'
      }`}
    >
      {/* Rank Indicator */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
          rankColors[entry.rank] || 'bg-surface-200 text-white/50'
        }`}
      >
        {entry.rank}
      </div>

      {/* Profile Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-sm text-white truncate">{entry.name}</span>
          {isCurrentUser && (
            <span className="text-[9px] text-accent font-bold uppercase tracking-wider">You</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-white/40 truncate">@{entry.username}</span>
          <Badge
            variant="gray"
            className="text-[8px] px-1.5 py-0 border-transparent"
            style={{ color: levelDetails.color, backgroundColor: `${levelDetails.color}15` }}
          >
            {levelDetails.title}
          </Badge>
        </div>
      </div>

      {/* Streak */}
      {entry.streak > 0 && (
        <div className="flex items-center gap-0.5 shrink-0 text-orange-500">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span className="text-xs font-bold">{entry.streak}</span>
        </div>
      )}

      {/* Score */}
      <div className="text-right shrink-0">
        <span className="text-sm font-black text-white">
          {type === 'global' ? entry.totalXP : entry.weeklyXP}{' '}
          <span className="text-[9px] text-white/40 font-semibold uppercase">XP</span>
        </span>
      </div>
    </div>
  );
}
