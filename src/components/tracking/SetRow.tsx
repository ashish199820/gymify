import { Check, X } from 'lucide-react';
import type { WorkoutSet } from '@/lib/types';

interface SetRowProps {
  set: WorkoutSet;
  index: number;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onRemove: () => void;
}

export function SetRow({ set, index, onUpdate, onRemove }: SetRowProps) {
  const isCompleted = !!set.completedAt;

  return (
    <div className="flex items-center gap-2 bg-surface-100 rounded-xl p-2 border border-white/5">
      {/* Set Number */}
      <span className="w-8 text-center text-xs font-semibold text-white/40">
        #{index + 1}
      </span>

      {/* Weight Input */}
      <div className="flex-1 flex items-center bg-surface-200 rounded-lg border border-white/5 px-2.5 py-1.5 focus-within:border-accent/40">
        <input
          type="number"
          value={set.weightKg}
          onChange={(e) => onUpdate({ weightKg: Math.max(0, parseFloat(e.target.value) || 0) })}
          disabled={isCompleted}
          className="bg-transparent w-full text-center text-xs text-white focus:outline-none disabled:opacity-50"
        />
        <span className="text-[10px] text-white/30 font-semibold uppercase ml-1">kg</span>
      </div>

      {/* Reps Input */}
      <div className="flex-1 flex items-center bg-surface-200 rounded-lg border border-white/5 px-2.5 py-1.5 focus-within:border-accent/40">
        <input
          type="number"
          value={set.reps}
          onChange={(e) => onUpdate({ reps: Math.max(1, parseInt(e.target.value) || 1) })}
          disabled={isCompleted}
          className="bg-transparent w-full text-center text-xs text-white focus:outline-none disabled:opacity-50"
        />
        <span className="text-[10px] text-white/30 font-semibold uppercase ml-1">reps</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onUpdate({ completedAt: isCompleted ? '' : new Date().toISOString() })}
          className={`p-2 rounded-lg border active:scale-95 transition-all ${
            isCompleted
              ? 'bg-accent border-accent text-black hover:bg-accent/80'
              : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'
          }`}
          aria-label={isCompleted ? 'Mark set uncompleted' : 'Mark set completed'}
        >
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </button>

        <button
          onClick={onRemove}
          className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors active:scale-95"
          aria-label="Delete set"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
