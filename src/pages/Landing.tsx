import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Sparkles, Zap, Trophy, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useUserStore } from '@/store/useUserStore';

export default function Landing() {
  const navigate = useNavigate();
  const { profile, isOnboarded, setProfile } = useUserStore();

  const [showOnboard, setShowOnboard] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [goal, setGoal] = useState<'strength' | 'hypertrophy' | 'endurance' | 'weight_loss' | 'general_fitness'>('hypertrophy');

  const handleStartClick = () => {
    if (isOnboarded) {
      navigate('/exercises');
    } else {
      setShowOnboard(true);
    }
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    setProfile({
      id: crypto.randomUUID(),
      name: name.trim(),
      username: username.trim().toLowerCase(),
      heightCm: parseInt(height) || 175,
      weightKg: parseInt(weight) || 70,
      gender,
      goal,
      totalXP: 0,
      streak: 0,
      longestStreak: 0,
      joinedAt: new Date().toISOString(),
    });

    navigate('/exercises');
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between p-6 bg-noise bg-black relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-brand-900/10 to-transparent pointer-events-none -z-10" />

      {/* Header */}
      <header className="flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-glow-green">
            <Dumbbell className="w-5 h-5 text-black" />
          </div>
          <span className="font-black tracking-tight text-white text-lg">GymFlow</span>
        </div>
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse-slow" />
          <span className="text-[10px] text-white/70 font-semibold tracking-wider uppercase">Beta PWA</span>
        </div>
      </header>

      {/* Content wrapper */}
      <main className="flex-1 flex flex-col justify-center items-center text-center z-10 gap-8 my-8 max-w-sm mx-auto">
        {!showOnboard ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
                Elevate Your <br />
                <span className="text-gradient">Gym Game</span>
              </h1>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">
                Track progressive overload, log sets, earn XP, and compete in the leaderboard. Fully works offline.
              </p>
            </div>

            {/* Feature lists */}
            <div className="flex flex-col gap-3 text-left">
              <div className="flex items-start gap-3 bg-white/3 border border-white/5 rounded-2xl p-3.5">
                <Zap className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-white">Gamified Workout Progress</h3>
                  <p className="text-[11px] text-white/40 leading-snug mt-0.5">
                    Earn XP based on consistency, reps, and weights. Level up from Rookie to Legend.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/3 border border-white/5 rounded-2xl p-3.5">
                <Trophy className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-white">Weekly & Global Ranks</h3>
                  <p className="text-[11px] text-white/40 leading-snug mt-0.5">
                    Compete on the weekly scoreboard. Maintain streaks for score multiplier bonuses.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleStartClick}
              size="lg"
              className="mt-2 font-black py-4 w-full shadow-glow-green"
            >
              {isOnboarded ? 'Launch Dashboard' : 'Get Started'}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleOnboardSubmit}
            className="w-full card-glass flex flex-col gap-4 text-left"
          >
            <div className="mb-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Create Profile</h2>
              <p className="text-xs text-white/40 mt-1">Let's set up your personal stats to calculate levels.</p>
            </div>

            <Input
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />

            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. johndoe"
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
              label="Gender"
              value={gender}
              onChange={(e: any) => setGender(e.target.value)}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
            />

            <Select
              label="Primary Goal"
              value={goal}
              onChange={(e: any) => setGoal(e.target.value)}
              options={[
                { value: 'hypertrophy', label: 'Muscle Growth (Hypertrophy)' },
                { value: 'strength', label: 'Increase Strength (Power)' },
                { value: 'endurance', label: 'Conditioning / Endurance' },
                { value: 'weight_loss', label: 'Weight Loss' },
                { value: 'general_fitness', label: 'General Health' },
              ]}
            />

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowOnboard(false)}
                fullWidth
              >
                Back
              </Button>
              <Button type="submit" variant="primary" fullWidth>
                Enter App
              </Button>
            </div>
          </motion.form>
        )}
      </main>

      {/* Footer */}
      <footer className="z-10 shrink-0 text-center flex flex-col gap-1.5 items-center">
        <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secure local device data storage</span>
        </div>
        <p className="text-[9px] text-white/20">
          GymFlow PWA © 2026. Made with <Heart className="w-2.5 h-2.5 inline fill-current text-danger" /> for athletes.
        </p>
      </footer>
    </div>
  );
}
