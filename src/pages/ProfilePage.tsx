import { useState } from 'react';
import { User, Ruler, Scale, Target, Flame, Trophy, Edit3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { XPBar } from '@/components/profile/XPBar';
import { useUserStore } from '@/store/useUserStore';
import { useTrackingStore } from '@/store/useTrackingStore';
import { getLevelFromXP } from '@/lib/xpEngine';

export default function ProfilePage() {
  const { profile, updateProfile, clearProfile } = useUserStore();
  const sessions = useTrackingStore((s) => s.sessions);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState(profile?.name ?? '');
  const [username, setUsername] = useState(profile?.username ?? '');
  const [height, setHeight] = useState(profile?.heightCm.toString() ?? '175');
  const [weight, setWeight] = useState(profile?.weightKg.toString() ?? '70');
  const [goal, setGoal] = useState(profile?.goal ?? 'hypertrophy');

  if (!profile) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      heightCm: parseInt(height) || 175,
      weightKg: parseInt(weight) || 70,
      goal,
    });
    setIsEditing(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all profile and workout history? This cannot be undone.')) {
      clearProfile();
      window.location.href = '/';
    }
  };

  // Workout metrics
  const totalWorkouts = sessions.length;
  const totalVolume = sessions.reduce((sum, s) => {
    return (
      sum +
      s.exercises.reduce((v, e) => {
        return v + e.sets.reduce((sv, set) => sv + set.weightKg * set.reps, 0);
      }, 0)
    );
  }, 0);

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">User Profile</h1>
          <p className="text-xs text-white/40 mt-1">Review your level progression, streaks, and fitness stats.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white/70 hover:text-white transition-all shrink-0"
          aria-label="Edit Profile"
        >
          <Edit3 className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* XP Progress Bar */}
      <XPBar totalXP={profile.totalXP} />

      {/* Edit Form / Details Display */}
      {isEditing ? (
        <form onSubmit={handleSave} className="card-glass flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Edit Profile Details</h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-white/40 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              label="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
            <Input
              type="number"
              label="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>

          <Select
            label="Goal"
            value={goal}
            onChange={(e: any) => setGoal(e.target.value)}
            options={[
              { value: 'hypertrophy', label: 'Muscle Growth (Hypertrophy)' },
              { value: 'strength', label: 'Build Strength' },
              { value: 'endurance', label: 'Conditioning / Endurance' },
              { value: 'weight_loss', label: 'Weight Loss' },
              { value: 'general_fitness', label: 'General Fitness' },
            ]}
          />

          <Button type="submit" variant="primary" fullWidth className="mt-2">
            Save Changes
          </Button>
        </form>
      ) : (
        <ProfileCard profile={profile} />
      )}

      {/* Fitness achievements/records summary */}
      <div className="card-glass flex flex-col gap-4">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Training Statistics</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block mb-1">
              Total Workouts
            </span>
            <span className="text-2xl font-black text-white">{totalWorkouts}</span>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block mb-1">
              Total Volume
            </span>
            <span className="text-xl font-black text-accent">{totalVolume} kg</span>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center col-span-2">
            <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block mb-1">
              Longest Streak
            </span>
            <span className="text-xl font-black text-orange-500 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-current" />
              <span>{profile.longestStreak} days</span>
            </span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="card-glass flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Advanced Actions</h3>
        <div className="flex flex-col gap-2">
          <Button variant="danger" size="sm" onClick={handleReset} fullWidth>
            Reset All Application Data
          </Button>
        </div>
      </div>
    </div>
  );
}
