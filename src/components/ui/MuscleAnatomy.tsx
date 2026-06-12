import { useMemo } from 'react';
import type { MuscleGroup } from '@/lib/types';

interface MuscleAnatomyProps {
  highlightedMuscles?: MuscleGroup[];
  muscleXP?: Record<MuscleGroup, number>;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  onSelectMuscle?: (muscle: MuscleGroup) => void;
}

export function MuscleAnatomy({
  highlightedMuscles = [],
  muscleXP,
  size = 'md',
  showLabels = false,
  onSelectMuscle,
}: MuscleAnatomyProps) {
  const isHeatmap = !!muscleXP;

  // Find max XP for heatmap scaling
  const maxXP = useMemo(() => {
    if (!muscleXP) return 0;
    const values = Object.values(muscleXP);
    return Math.max(...values, 1);
  }, [muscleXP]);

  const getMuscleColor = (muscle: MuscleGroup) => {
    if (isHeatmap) {
      const xp = muscleXP?.[muscle] ?? 0;
      if (xp === 0) return 'rgba(255, 255, 255, 0.05)';
      const ratio = Math.min(xp / maxXP, 1);
      return `rgba(163, 230, 53, ${0.15 + ratio * 0.85})`;
    }

    // Standard highlight mode
    const isHighlighted = highlightedMuscles.includes(muscle);
    return isHighlighted
      ? 'rgba(163, 230, 53, 0.9)' // vibrant lime
      : 'rgba(255, 255, 255, 0.08)'; // dark gray
  };

  const getMuscleStroke = (muscle: MuscleGroup) => {
    if (isHeatmap) {
      const xp = muscleXP?.[muscle] ?? 0;
      return xp > 0 ? 'rgba(163, 230, 53, 0.4)' : 'rgba(255, 255, 255, 0.1)';
    }
    const isHighlighted = highlightedMuscles.includes(muscle);
    return isHighlighted ? 'rgba(163, 230, 53, 1)' : 'rgba(255, 255, 255, 0.1)';
  };

  const sizeClasses = {
    sm: 'w-24 h-40',
    md: 'w-48 h-56',
    lg: 'w-64 h-72',
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Side-by-side figures */}
      <div className="flex justify-center gap-6 bg-white/2 border border-white/5 rounded-2xl p-4 w-full">
        {/* Front view */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Front</span>
          <svg
            viewBox="0 0 100 170"
            className={`${sizeClasses[size]} transition-all duration-300`}
          >
            {/* Outline body background */}
            <circle cx="50" cy="15" r="7" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
            <line x1="50" y1="22" x2="50" y2="26" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />

            {/* Chest */}
            <polygon
              points="37,27 49,27 49,39 37,39"
              fill={getMuscleColor('chest')}
              stroke={getMuscleStroke('chest')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('chest')}
            />
            <polygon
              points="51,27 63,27 63,39 51,39"
              fill={getMuscleColor('chest')}
              stroke={getMuscleStroke('chest')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('chest')}
            />

            {/* Shoulders */}
            <polygon
              points="28,26 36,26 34,38 26,35"
              fill={getMuscleColor('shoulder')}
              stroke={getMuscleStroke('shoulder')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('shoulder')}
            />
            <polygon
              points="64,26 72,26 74,35 66,38"
              fill={getMuscleColor('shoulder')}
              stroke={getMuscleStroke('shoulder')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('shoulder')}
            />

            {/* Biceps */}
            <polygon
              points="22,36 27,37 25,51 20,46"
              fill={getMuscleColor('biceps')}
              stroke={getMuscleStroke('biceps')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('biceps')}
            />
            <polygon
              points="73,37 78,36 80,46 75,51"
              fill={getMuscleColor('biceps')}
              stroke={getMuscleStroke('biceps')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('biceps')}
            />

            {/* Core / Abs */}
            <polygon
              points="40,41 60,41 58,68 42,68"
              fill={getMuscleColor('core_abs')}
              stroke={getMuscleStroke('core_abs')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('core_abs')}
            />

            {/* Upper Legs (Quads) */}
            <polygon
              points="35,71 48,71 45,110 32,105"
              fill={getMuscleColor('upper_leg')}
              stroke={getMuscleStroke('upper_leg')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('upper_leg')}
            />
            <polygon
              points="52,71 65,71 68,105 55,110"
              fill={getMuscleColor('upper_leg')}
              stroke={getMuscleStroke('upper_leg')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('upper_leg')}
            />

            {/* Calves */}
            <polygon
              points="32,112 43,114 40,150 31,146"
              fill={getMuscleColor('lower_leg')}
              stroke={getMuscleStroke('lower_leg')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('lower_leg')}
            />
            <polygon
              points="57,114 68,112 69,146 60,150"
              fill={getMuscleColor('lower_leg')}
              stroke={getMuscleStroke('lower_leg')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('lower_leg')}
            />
          </svg>
        </div>

        {/* Back view */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Back</span>
          <svg
            viewBox="0 0 100 170"
            className={`${sizeClasses[size]} transition-all duration-300`}
          >
            {/* Outline body background */}
            <circle cx="50" cy="15" r="7" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
            <line x1="50" y1="22" x2="50" y2="26" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />

            {/* Back (Lats/Traps) */}
            <polygon
              points="37,27 63,27 61,60 39,60"
              fill={getMuscleColor('back')}
              stroke={getMuscleStroke('back')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('back')}
            />

            {/* Shoulders */}
            <polygon
              points="28,26 36,26 34,38 26,35"
              fill={getMuscleColor('shoulder')}
              stroke={getMuscleStroke('shoulder')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('shoulder')}
            />
            <polygon
              points="64,26 72,26 74,35 66,38"
              fill={getMuscleColor('shoulder')}
              stroke={getMuscleStroke('shoulder')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('shoulder')}
            />

            {/* Triceps */}
            <polygon
              points="22,36 27,37 25,51 20,46"
              fill={getMuscleColor('triceps')}
              stroke={getMuscleStroke('triceps')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('triceps')}
            />
            <polygon
              points="73,37 78,36 80,46 75,51"
              fill={getMuscleColor('triceps')}
              stroke={getMuscleStroke('triceps')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('triceps')}
            />

            {/* Glutes */}
            <polygon
              points="38,62 62,62 60,78 40,78"
              fill={getMuscleColor('glutes')}
              stroke={getMuscleStroke('glutes')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('glutes')}
            />

            {/* Upper Legs (Hamstrings) */}
            <polygon
              points="34,80 48,80 46,112 32,110"
              fill={getMuscleColor('upper_leg')}
              stroke={getMuscleStroke('upper_leg')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('upper_leg')}
            />
            <polygon
              points="52,80 66,80 68,110 54,112"
              fill={getMuscleColor('upper_leg')}
              stroke={getMuscleStroke('upper_leg')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('upper_leg')}
            />

            {/* Calves */}
            <polygon
              points="32,114 43,115 40,150 31,146"
              fill={getMuscleColor('lower_leg')}
              stroke={getMuscleStroke('lower_leg')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('lower_leg')}
            />
            <polygon
              points="57,115 68,114 69,146 60,150"
              fill={getMuscleColor('lower_leg')}
              stroke={getMuscleStroke('lower_leg')}
              strokeWidth="1"
              className="cursor-pointer hover:brightness-125 transition-all duration-200"
              onClick={() => onSelectMuscle?.('lower_leg')}
            />
          </svg>
        </div>
      </div>

      {/* Muscle Labels / Heatmap Legends */}
      {showLabels && (
        <div className="flex flex-wrap justify-center gap-1.5 px-2">
          {highlightedMuscles.map((muscle) => (
            <span
              key={muscle}
              className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-accent/15 border border-accent/35 text-accent uppercase tracking-wider"
            >
              {muscle.replace('_', ' ')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
