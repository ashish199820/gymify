import { User, Ruler, Scale, Target, Flame } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

interface ProfileCardProps {
  profile: UserProfile;
}

const goalLabels: Record<UserProfile['goal'], string> = {
  strength:        'Build Strength',
  hypertrophy:     'Muscle Growth',
  endurance:       'Conditioning & Endurance',
  weight_loss:     'Fat / Weight Loss',
  general_fitness: 'Stay Fit & Regular',
};

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="card-glass flex flex-col gap-5">
      {/* User Avatar + basic info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
          <User className="w-8 h-8 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-white truncate">{profile.name}</h2>
          <p className="text-xs text-white/40 truncate">@{profile.username}</p>
        </div>
        <div className="flex flex-col items-center shrink-0 bg-orange-950/20 border border-orange-700/20 rounded-xl px-2.5 py-1.5">
          <Flame className="w-5 h-5 text-orange-500 fill-current animate-pulse-slow" />
          <span className="text-sm font-black text-white mt-0.5">{profile.streak}</span>
          <span className="text-[8px] text-orange-400 font-bold uppercase tracking-wider">streak</span>
        </div>
      </div>

      <div className="divider my-1" />

      {/* Grid of stats */}
      <div className="grid grid-cols-2 gap-4">
        {/* Height */}
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
          <Ruler className="w-5 h-5 text-white/40 shrink-0" />
          <div>
            <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block">Height</span>
            <span className="text-sm font-bold text-white">{profile.heightCm} cm</span>
          </div>
        </div>

        {/* Weight */}
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
          <Scale className="w-5 h-5 text-white/40 shrink-0" />
          <div>
            <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block">Weight</span>
            <span className="text-sm font-bold text-white">{profile.weightKg} kg</span>
          </div>
        </div>

        {/* Gender */}
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3 col-span-2">
          <Target className="w-5 h-5 text-white/40 shrink-0" />
          <div>
            <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block">Fitness Goal</span>
            <span className="text-sm font-bold text-white">{goalLabels[profile.goal]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
