import { useState, useMemo } from 'react';
import { Search, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ExerciseCard } from './ExerciseCard';
import { exercises, MUSCLE_GROUPS } from '@/lib/exercises';
import type { Exercise, MuscleGroup } from '@/lib/types';

interface ExercisePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (selectedExercises: Exercise[]) => void;
  initialSelectedIds?: string[];
  title?: string;
  multiSelect?: boolean;
}

export function ExercisePicker({
  open,
  onClose,
  onSelect,
  initialSelectedIds = [],
  title = 'Select Exercises',
  multiSelect = true,
}: ExercisePickerProps) {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.primaryMuscles.toLowerCase().includes(search.toLowerCase());
      const matchesMuscle = selectedMuscle === 'all' || ex.muscleGroup === selectedMuscle;
      return matchesSearch && matchesMuscle;
    });
  }, [search, selectedMuscle]);

  const handleSelectCard = (ex: Exercise) => {
    if (!multiSelect) {
      onSelect([ex]);
      onClose();
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(ex.id) ? prev.filter((id) => id !== ex.id) : [...prev, ex.id]
    );
  };

  const handleConfirm = () => {
    const selected = exercises.filter((ex) => selectedIds.includes(ex.id));
    onSelect(selected);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title} size="full">
      <div className="flex flex-col h-full">
        {/* Search */}
        <div className="p-4 border-b border-white/5 flex flex-col gap-3 shrink-0">
          <div className="relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercise or muscle..."
              className="pl-10"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
          </div>

          {/* Muscle Chips Scroll */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hidden touch-pan-x">
            <button
              onClick={() => setSelectedMuscle('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                selectedMuscle === 'all'
                  ? 'bg-accent border-accent text-black shadow-glow-green'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              All Muscles
            </button>
            {MUSCLE_GROUPS.map((mg) => (
              <button
                key={mg.id}
                onClick={() => setSelectedMuscle(mg.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  selectedMuscle === mg.id
                    ? 'bg-accent border-accent text-black shadow-glow-green'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {mg.emoji} {mg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              No exercises found.
            </div>
          ) : (
            filteredExercises.map((ex) => {
              const isSelected = selectedIds.includes(ex.id);
              return (
                <div key={ex.id} className="relative">
                  <ExerciseCard
                    exercise={ex}
                    selectable
                    selected={isSelected}
                    onSelect={handleSelectCard}
                  />
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-accent text-black rounded-full p-1 border border-black z-10 pointer-events-none">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Confirm button */}
        {multiSelect && (
          <div className="p-4 border-t border-white/5 bg-surface-50 shrink-0">
            <Button onClick={handleConfirm} fullWidth variant="primary">
              Confirm {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
