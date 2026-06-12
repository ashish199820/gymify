import { getLevelFromXP, getProgressToNextLevel, getXPToNextLevel } from '@/lib/xpEngine';
import { ProgressBar } from '../ui/ProgressBar';

interface XPBarProps {
  totalXP: number;
}

export function XPBar({ totalXP }: XPBarProps) {
  const currentLevel = getLevelFromXP(totalXP);
  const progress = getProgressToNextLevel(totalXP);
  const xpRemaining = getXPToNextLevel(totalXP);

  return (
    <div className="card-glass flex flex-col gap-4">
      {/* Current Level Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">
            Level {currentLevel.level}
          </span>
          <h3
            className="text-2xl font-black tracking-tight"
            style={{ color: currentLevel.color }}
          >
            {currentLevel.title}
          </h3>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-xl font-bold tracking-tight text-white">
            {totalXP} <span className="text-xs text-white/40">XP</span>
          </span>
          {xpRemaining > 0 ? (
            <span className="text-[10px] text-white/40">
              {xpRemaining} XP to Level {currentLevel.level + 1}
            </span>
          ) : (
            <span className="text-[10px] text-accent font-semibold">MAX LEVEL REACHED</span>
          )}
        </div>
      </div>

      {/* Progress Bar slider */}
      <ProgressBar
        value={progress}
        color="lime"
        size="md"
        className="w-full"
      />
    </div>
  );
}
