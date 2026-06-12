import { useState } from 'react';
import { PlayCircle, Info } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { TutorialModal } from './TutorialModal';
import type { Exercise } from '@/lib/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: (exercise: Exercise) => void;
  selected?: boolean;
  selectable?: boolean;
}

export function ExerciseCard({ exercise, onSelect, selected, selectable }: ExerciseCardProps) {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <>
      <div
        onClick={() => selectable && onSelect?.(exercise)}
        className={`card-glass flex flex-col justify-between gap-4 cursor-pointer hover:border-white/20 transition-all duration-200 ${
          selected ? 'border-accent/50 bg-accent/5 ring-1 ring-accent/20' : ''
        }`}
      >
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate text-base">{exercise.name}</h3>
            <p className="text-xs text-white/50 truncate mt-0.5">{exercise.primaryMuscles}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTutorial(true);
            }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium shrink-0"
            aria-label="View tutorial"
          >
            <PlayCircle className="w-4 h-4 text-accent" />
            <span>Guide</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="gray" className="text-[10px]">{exercise.mechanics}</Badge>
          <Badge variant="lime" className="text-[10px]">{exercise.equipment}</Badge>
        </div>
      </div>

      <TutorialModal
        exercise={exercise}
        open={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </>
  );
}
