import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { MuscleAnatomy } from '../ui/MuscleAnatomy';
import { Sparkles } from 'lucide-react';
import type { Exercise } from '@/lib/types';

interface TutorialModalProps {
  exercise: Exercise | null;
  open: boolean;
  onClose: () => void;
}

export function TutorialModal({ exercise, open, onClose }: TutorialModalProps) {
  if (!exercise) return null;

  return (
    <Modal open={open} onClose={onClose} title={`${exercise.name} Tutorial`}>
      <div className="p-5 flex flex-col gap-6">
        {/* Banner / Graphic Placeholder */}
        <div className="relative aspect-video rounded-2xl bg-surface-100 border border-white/5 overflow-hidden flex items-center justify-center">
          {/* Subtle animated overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent animate-pulse-slow" />
          
          <div className="z-20 text-center px-4">
            <Badge variant="lime" className="mb-2">DEMO ANIMATION</Badge>
            <h3 className="text-xl font-bold tracking-tight">{exercise.name}</h3>
            <p className="text-xs text-white/50 mt-1">Focus on slow, controlled eccentric phase</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="lime">{exercise.mechanics}</Badge>
          <Badge variant="blue">Primary: {exercise.primaryMuscles}</Badge>
          {exercise.secondaryMuscles && exercise.secondaryMuscles !== 'None' && (
            <Badge variant="gray">Secondary: {exercise.secondaryMuscles}</Badge>
          )}
          <Badge variant="gold">Equipment: {exercise.equipment || 'Bodyweight'}</Badge>
        </div>

        {/* Muscle Activation Visualizer */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Muscle Activation Map</h4>
          <MuscleAnatomy highlightedMuscles={[exercise.muscleGroup]} size="sm" showLabels />
        </div>

        {/* Setup checklist */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-accent font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Target Mechanics Guide</span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Ensure you carry out this exercise through the full range of motion. Keep weights challenging but controllable.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Step-by-Step Instructions</h4>
          <div className="flex flex-col gap-3">
            {exercise.tutorial.map((step) => (
              <div key={step.step} className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-accent">{step.step}</span>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <h5 className="text-sm font-semibold text-white/90">{step.title}</h5>
                  <p className="text-xs text-white/60 leading-relaxed">{step.description}</p>
                  {step.tip && (
                    <span className="text-[10px] text-accent/80 font-medium italic mt-0.5">
                      💡 Pro Tip: {step.tip}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
