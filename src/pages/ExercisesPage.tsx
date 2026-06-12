import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { MuscleAnatomy } from '@/components/ui/MuscleAnatomy';
import { exercises, MUSCLE_GROUPS } from '@/lib/exercises';
import type { MuscleGroup } from '@/lib/types';

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.primaryMuscles.toLowerCase().includes(search.toLowerCase());
      const matchesMuscle = selectedMuscle === 'all' || ex.muscleGroup === selectedMuscle;
      return matchesSearch && matchesMuscle;
    });
  }, [search, selectedMuscle]);

  const handleSelectMuscle = (muscle: MuscleGroup) => {
    setSelectedMuscle((prev) => (prev === muscle ? 'all' : muscle));
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Exercise Database</h1>
        <p className="text-xs text-white/40 mt-1">Browse movements, access tutorials, and check targeted muscles.</p>
      </div>

      {/* Interactive Muscle Anatomy Map Filter */}
      <div className="card-glass flex flex-col gap-3 shrink-0">
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tap Muscle to Filter</h3>
          <p className="text-[11px] text-white/40 mt-0.5">Select a muscle group directly on the body map.</p>
        </div>
        <MuscleAnatomy
          highlightedMuscles={selectedMuscle !== 'all' ? [selectedMuscle] : []}
          onSelectMuscle={handleSelectMuscle}
          size="sm"
        />
        {selectedMuscle !== 'all' && (
          <button
            onClick={() => setSelectedMuscle('all')}
            className="text-[10px] text-accent hover:underline font-bold uppercase tracking-wider self-center mt-1"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dumbbell, bench press..."
          className="pl-10"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
      </div>

      {/* Muscle Chips Scrollable selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hidden touch-pan-x shrink-0">
        <button
          onClick={() => setSelectedMuscle('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
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
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
              selectedMuscle === mg.id
                ? 'bg-accent border-accent text-black shadow-glow-green'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {mg.emoji} {mg.label}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="flex flex-col gap-3">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm">
            No movements match your query. Try something else!
          </div>
        ) : (
          filteredExercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))
        )}
      </div>
    </div>
  );
}
