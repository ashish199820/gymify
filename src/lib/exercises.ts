import type { Exercise, MuscleGroup, TutorialStep } from './types';

// Tutorial steps are generated generically based on exercise mechanics
function buildTutorial(name: string, mechanics: string, equipment: string): TutorialStep[] {
  const isCompound = mechanics === 'Compound';
  const steps: TutorialStep[] = [
    {
      step: 1,
      title: 'Setup & Equipment',
      description: `Prepare your ${equipment || 'body weight'} and ensure the area is clear. Adjust any equipment to fit your body proportions.`,
      tip: 'Double-check your grip and footing before starting.',
    },
    {
      step: 2,
      title: 'Starting Position',
      description: isCompound
        ? 'Brace your core, keep your spine neutral, and position your body for maximum power transfer.'
        : 'Isolate the target muscle by stabilizing your non-working joints. Keep everything else still.',
      tip: isCompound ? 'Think about full-body tension.' : 'Minimize movement in non-target joints.',
    },
    {
      step: 3,
      title: 'Concentric Phase (Lift)',
      description: `Exhale and contract the target muscle to perform the ${name} movement through its full range of motion.`,
      tip: 'Move with control — 1-2 seconds up.',
    },
    {
      step: 4,
      title: 'Peak Contraction',
      description: 'Pause at the peak of the movement for a brief squeeze. Feel the muscle fully engaged.',
      tip: 'Do not lock out joints aggressively.',
    },
    {
      step: 5,
      title: 'Eccentric Phase (Lower)',
      description: 'Inhale and slowly lower back to starting position, resisting gravity throughout.',
      tip: '2-3 seconds down for maximum muscle stimulus.',
    },
    {
      step: 6,
      title: 'Rest & Repeat',
      description: 'Rest 60–120 seconds between sets for hypertrophy, or 3–5 minutes for strength. Maintain form on every rep.',
      tip: 'Quality > quantity. Reduce weight before breaking form.',
    },
  ];
  return steps;
}

// Raw exercise data parsed from CSVs
const rawExercises: Array<{
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  primaryMuscles: string;
  secondaryMuscles: string;
  equipment: string;
  mechanics: string;
}> = [
  // ── CHEST ────────────────────────────────────────────────────────────
  { id: 'chest_0',  name: 'Dumbbell Fly',            muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major',           secondaryMuscles: 'Anterior Deltoid',                     equipment: 'Dumbbells, Flat Bench',       mechanics: 'Isolation' },
  { id: 'chest_1',  name: 'Machine Fly (Pec Deck)',  muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major',           secondaryMuscles: 'Anterior Deltoid',                     equipment: 'Pec Deck Machine',            mechanics: 'Isolation' },
  { id: 'chest_2',  name: 'Cable Standing Fly',      muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major',           secondaryMuscles: 'Anterior Deltoid, Biceps',             equipment: 'Cable Machine',               mechanics: 'Isolation' },
  { id: 'chest_3',  name: 'Depth Push-Up',           muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major',           secondaryMuscles: 'Anterior Deltoid, Triceps',            equipment: 'Plyometric Boxes',            mechanics: 'Compound' },
  { id: 'chest_4',  name: 'Clap Push-Up',            muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major',           secondaryMuscles: 'Anterior Deltoid, Triceps',            equipment: 'Bodyweight',                  mechanics: 'Compound' },
  { id: 'chest_5',  name: 'Single Arm Cable Press',  muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major',           secondaryMuscles: 'Serratus Anterior, Triceps',           equipment: 'Cable Machine',               mechanics: 'Compound' },
  { id: 'chest_6',  name: 'Machine Chest Press',     muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major',           secondaryMuscles: 'Triceps, Anterior Deltoid',            equipment: 'Chest Press Machine',         mechanics: 'Compound' },
  { id: 'chest_7',  name: 'Incline Bench Press',     muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major (Clavicular)', secondaryMuscles: 'Anterior Deltoid, Triceps',         equipment: 'Barbell, Incline Bench',      mechanics: 'Compound' },
  { id: 'chest_8',  name: 'Incline Dumbbell Press',  muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major (Clavicular)', secondaryMuscles: 'Anterior Deltoid, Triceps',         equipment: 'Dumbbells, Incline Bench',    mechanics: 'Compound' },
  { id: 'chest_9',  name: 'Barbell Bench Press',     muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major (Sternal)', secondaryMuscles: 'Anterior Deltoid, Triceps',            equipment: 'Barbell, Flat Bench',         mechanics: 'Compound' },
  { id: 'chest_10', name: 'Dumbbell Bench Press',    muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major (Sternal)', secondaryMuscles: 'Anterior Deltoid, Triceps',            equipment: 'Dumbbells, Flat Bench',       mechanics: 'Compound' },
  { id: 'chest_11', name: 'Push-Ups',                muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major (Sternal)', secondaryMuscles: 'Anterior Deltoid, Triceps',            equipment: 'Bodyweight',                  mechanics: 'Compound' },
  { id: 'chest_12', name: 'Decline Bench Press',     muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major (Sternal)', secondaryMuscles: 'Triceps, Anterior Deltoid',            equipment: 'Barbell, Decline Bench',      mechanics: 'Compound' },
  { id: 'chest_13', name: 'Dips (Chest)',            muscleGroup: 'chest', primaryMuscles: 'Pectoralis Major (Sternal)', secondaryMuscles: 'Triceps, Anterior Deltoid',            equipment: 'Dip Station',                 mechanics: 'Compound' },

  // ── BACK ─────────────────────────────────────────────────────────────
  { id: 'back_0',  name: 'Pull-Up',                  muscleGroup: 'back',  primaryMuscles: 'Latissimus Dorsi',           secondaryMuscles: 'Biceps Brachii, Rhomboids',            equipment: 'Pull-Up Bar',                 mechanics: 'Compound' },
  { id: 'back_1',  name: 'Lat Pulldown',             muscleGroup: 'back',  primaryMuscles: 'Latissimus Dorsi',           secondaryMuscles: 'Biceps Brachii, Trapezius',            equipment: 'Cable Machine',               mechanics: 'Compound' },
  { id: 'back_2',  name: 'Dumbbell One-Arm Row',     muscleGroup: 'back',  primaryMuscles: 'Latissimus Dorsi',           secondaryMuscles: 'Biceps Brachii, Trapezius',            equipment: 'Dumbbell, Flat Bench',        mechanics: 'Compound' },
  { id: 'back_3',  name: 'Chin-Up',                  muscleGroup: 'back',  primaryMuscles: 'Latissimus Dorsi',           secondaryMuscles: 'Biceps Brachii, Trapezius',            equipment: 'Pull-Up Bar',                 mechanics: 'Compound' },
  { id: 'back_4',  name: 'Bent-Over Barbell Row',    muscleGroup: 'back',  primaryMuscles: 'Latissimus Dorsi',           secondaryMuscles: 'Rhomboids, Trapezius',                  equipment: 'Barbell',                     mechanics: 'Compound' },
  { id: 'back_5',  name: 'Seated Cable Row',         muscleGroup: 'back',  primaryMuscles: 'Latissimus Dorsi',           secondaryMuscles: 'Rhomboids, Trapezius',                  equipment: 'Cable Machine',               mechanics: 'Compound' },
  { id: 'back_6',  name: 'T-Bar Row',                muscleGroup: 'back',  primaryMuscles: 'Latissimus Dorsi',           secondaryMuscles: 'Rhomboids, Trapezius',                  equipment: 'T-Bar Machine',               mechanics: 'Compound' },
  { id: 'back_7',  name: 'Reverse Fly',              muscleGroup: 'back',  primaryMuscles: 'Rhomboids',                  secondaryMuscles: 'Posterior Deltoid, Trapezius',          equipment: 'Dumbbells, Bench',            mechanics: 'Isolation' },
  { id: 'back_8',  name: 'Barbell Shrug',            muscleGroup: 'back',  primaryMuscles: 'Upper Trapezius',            secondaryMuscles: 'Middle Trapezius, Levator Scapulae',   equipment: 'Barbell',                     mechanics: 'Isolation' },
  { id: 'back_9',  name: 'Dumbbell Shrug',           muscleGroup: 'back',  primaryMuscles: 'Upper Trapezius',            secondaryMuscles: 'Middle Trapezius, Levator Scapulae',   equipment: 'Dumbbells',                   mechanics: 'Isolation' },

  // ── BICEPS ───────────────────────────────────────────────────────────
  { id: 'biceps_0',  name: 'Barbell Curl',            muscleGroup: 'biceps', primaryMuscles: 'Biceps Brachii',           secondaryMuscles: 'Brachialis, Brachioradialis',          equipment: 'Barbell',                     mechanics: 'Isolation' },
  { id: 'biceps_1',  name: 'Dumbbell Alternating Curl', muscleGroup: 'biceps', primaryMuscles: 'Biceps Brachii',        secondaryMuscles: 'Brachialis, Anterior Delt',            equipment: 'Dumbbells',                   mechanics: 'Isolation' },
  { id: 'biceps_2',  name: 'Incline Dumbbell Curl',  muscleGroup: 'biceps', primaryMuscles: 'Biceps Brachii (Long Head)', secondaryMuscles: 'Brachialis',                         equipment: 'Dumbbells, Incline Bench',    mechanics: 'Isolation' },
  { id: 'biceps_3',  name: 'Preacher Curl',           muscleGroup: 'biceps', primaryMuscles: 'Biceps Brachii (Short Head)', secondaryMuscles: 'Brachialis',                       equipment: 'EZ Bar, Preacher Bench',      mechanics: 'Isolation' },
  { id: 'biceps_4',  name: 'Hammer Curl',             muscleGroup: 'biceps', primaryMuscles: 'Brachialis',               secondaryMuscles: 'Brachioradialis, Biceps',              equipment: 'Dumbbells',                   mechanics: 'Isolation' },
  { id: 'biceps_5',  name: 'Concentration Curl',      muscleGroup: 'biceps', primaryMuscles: 'Brachialis',               secondaryMuscles: 'Biceps Brachii',                       equipment: 'Dumbbell, Bench',             mechanics: 'Isolation' },
  { id: 'biceps_6',  name: 'Cable Curl',              muscleGroup: 'biceps', primaryMuscles: 'Biceps Brachii',           secondaryMuscles: 'Brachialis',                           equipment: 'Cable Machine',               mechanics: 'Isolation' },

  // ── TRICEPS ──────────────────────────────────────────────────────────
  { id: 'triceps_0', name: 'Tricep Pushdown',         muscleGroup: 'triceps', primaryMuscles: 'Triceps Brachii',         secondaryMuscles: 'Anconeus',                             equipment: 'Cable Machine',               mechanics: 'Isolation' },
  { id: 'triceps_1', name: 'Overhead Tricep Extension', muscleGroup: 'triceps', primaryMuscles: 'Triceps Brachii (Long Head)', secondaryMuscles: 'Anconeus',                     equipment: 'Dumbbell / Cable',            mechanics: 'Isolation' },
  { id: 'triceps_2', name: 'Skull Crusher',           muscleGroup: 'triceps', primaryMuscles: 'Triceps Brachii',         secondaryMuscles: 'Anconeus',                             equipment: 'EZ Bar / Barbell',            mechanics: 'Isolation' },
  { id: 'triceps_3', name: 'Diamond Push-Up',         muscleGroup: 'triceps', primaryMuscles: 'Triceps Brachii',         secondaryMuscles: 'Pectoralis Major',                     equipment: 'Bodyweight',                  mechanics: 'Compound' },
  { id: 'triceps_4', name: 'Close-Grip Bench Press',  muscleGroup: 'triceps', primaryMuscles: 'Triceps Brachii',         secondaryMuscles: 'Pectoralis Major, Anterior Deltoid',  equipment: 'Barbell, Flat Bench',         mechanics: 'Compound' },
  { id: 'triceps_5', name: 'Dips (Tricep)',           muscleGroup: 'triceps', primaryMuscles: 'Triceps Brachii',         secondaryMuscles: 'Pectoralis Major',                     equipment: 'Dip Station',                 mechanics: 'Compound' },
  { id: 'triceps_6', name: 'Kickbacks',               muscleGroup: 'triceps', primaryMuscles: 'Triceps Brachii',         secondaryMuscles: 'Anconeus',                             equipment: 'Dumbbell',                    mechanics: 'Isolation' },

  // ── SHOULDER ─────────────────────────────────────────────────────────
  { id: 'shoulder_0', name: 'Overhead Press (Barbell)', muscleGroup: 'shoulder', primaryMuscles: 'Anterior Deltoid',    secondaryMuscles: 'Lateral Deltoid, Triceps',             equipment: 'Barbell',                     mechanics: 'Compound' },
  { id: 'shoulder_1', name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulder', primaryMuscles: 'Anterior Deltoid',     secondaryMuscles: 'Lateral Deltoid, Triceps',             equipment: 'Dumbbells',                   mechanics: 'Compound' },
  { id: 'shoulder_2', name: 'Lateral Raise',          muscleGroup: 'shoulder', primaryMuscles: 'Lateral Deltoid',       secondaryMuscles: 'Anterior Deltoid, Trapezius',          equipment: 'Dumbbells',                   mechanics: 'Isolation' },
  { id: 'shoulder_3', name: 'Front Raise',            muscleGroup: 'shoulder', primaryMuscles: 'Anterior Deltoid',      secondaryMuscles: 'Lateral Deltoid',                      equipment: 'Dumbbells / Plate',           mechanics: 'Isolation' },
  { id: 'shoulder_4', name: 'Rear Delt Fly',          muscleGroup: 'shoulder', primaryMuscles: 'Posterior Deltoid',     secondaryMuscles: 'Rhomboids, Trapezius',                  equipment: 'Dumbbells / Cable',           mechanics: 'Isolation' },
  { id: 'shoulder_5', name: 'Arnold Press',           muscleGroup: 'shoulder', primaryMuscles: 'Anterior Deltoid',      secondaryMuscles: 'Lateral Deltoid, Triceps',             equipment: 'Dumbbells',                   mechanics: 'Compound' },
  { id: 'shoulder_6', name: 'Upright Row',            muscleGroup: 'shoulder', primaryMuscles: 'Lateral Deltoid',       secondaryMuscles: 'Anterior Deltoid, Trapezius',          equipment: 'Barbell / Dumbbells',         mechanics: 'Compound' },

  // ── CORE / ABS ───────────────────────────────────────────────────────
  { id: 'core_0',  name: 'Plank',                     muscleGroup: 'core_abs', primaryMuscles: 'Rectus Abdominis',      secondaryMuscles: 'Transverse Abdominis, Obliques',       equipment: 'Bodyweight',                  mechanics: 'Isolation' },
  { id: 'core_1',  name: 'Crunches',                  muscleGroup: 'core_abs', primaryMuscles: 'Rectus Abdominis',      secondaryMuscles: 'Obliques',                             equipment: 'Bodyweight',                  mechanics: 'Isolation' },
  { id: 'core_2',  name: 'Bicycle Crunch',            muscleGroup: 'core_abs', primaryMuscles: 'Obliques',              secondaryMuscles: 'Rectus Abdominis',                     equipment: 'Bodyweight',                  mechanics: 'Isolation' },
  { id: 'core_3',  name: 'Leg Raise',                 muscleGroup: 'core_abs', primaryMuscles: 'Rectus Abdominis (Lower)', secondaryMuscles: 'Hip Flexors',                     equipment: 'Bodyweight',                  mechanics: 'Isolation' },
  { id: 'core_4',  name: 'Cable Crunch',              muscleGroup: 'core_abs', primaryMuscles: 'Rectus Abdominis',      secondaryMuscles: 'Obliques',                             equipment: 'Cable Machine',               mechanics: 'Isolation' },
  { id: 'core_5',  name: 'Russian Twist',             muscleGroup: 'core_abs', primaryMuscles: 'Obliques',              secondaryMuscles: 'Rectus Abdominis',                     equipment: 'Plate / Dumbbell',            mechanics: 'Isolation' },
  { id: 'core_6',  name: 'Ab Rollout',                muscleGroup: 'core_abs', primaryMuscles: 'Rectus Abdominis',      secondaryMuscles: 'Transverse Abdominis, Shoulders',      equipment: 'Ab Wheel',                    mechanics: 'Compound' },

  // ── UPPER LEG ────────────────────────────────────────────────────────
  { id: 'upper_leg_0', name: 'Barbell Squat',         muscleGroup: 'upper_leg', primaryMuscles: 'Quadriceps',          secondaryMuscles: 'Glutes, Hamstrings',                   equipment: 'Barbell, Rack',               mechanics: 'Compound' },
  { id: 'upper_leg_1', name: 'Leg Press',             muscleGroup: 'upper_leg', primaryMuscles: 'Quadriceps',          secondaryMuscles: 'Glutes, Hamstrings',                   equipment: 'Leg Press Machine',           mechanics: 'Compound' },
  { id: 'upper_leg_2', name: 'Hack Squat',            muscleGroup: 'upper_leg', primaryMuscles: 'Quadriceps',          secondaryMuscles: 'Glutes, Hamstrings',                   equipment: 'Hack Squat Machine',          mechanics: 'Compound' },
  { id: 'upper_leg_3', name: 'Leg Extension',         muscleGroup: 'upper_leg', primaryMuscles: 'Quadriceps',          secondaryMuscles: 'None',                                 equipment: 'Leg Extension Machine',       mechanics: 'Isolation' },
  { id: 'upper_leg_4', name: 'Romanian Deadlift',     muscleGroup: 'upper_leg', primaryMuscles: 'Hamstrings',          secondaryMuscles: 'Glutes, Lower Back',                   equipment: 'Barbell',                     mechanics: 'Compound' },
  { id: 'upper_leg_5', name: 'Leg Curl',              muscleGroup: 'upper_leg', primaryMuscles: 'Hamstrings',          secondaryMuscles: 'Gastrocnemius',                        equipment: 'Leg Curl Machine',            mechanics: 'Isolation' },
  { id: 'upper_leg_6', name: 'Walking Lunges',        muscleGroup: 'upper_leg', primaryMuscles: 'Quadriceps',          secondaryMuscles: 'Glutes, Hamstrings',                   equipment: 'Bodyweight / Dumbbells',      mechanics: 'Compound' },
  { id: 'upper_leg_7', name: 'Bulgarian Split Squat', muscleGroup: 'upper_leg', primaryMuscles: 'Quadriceps',          secondaryMuscles: 'Glutes, Hamstrings',                   equipment: 'Dumbbells, Bench',            mechanics: 'Compound' },

  // ── LOWER LEG ────────────────────────────────────────────────────────
  { id: 'lower_leg_0', name: 'Standing Calf Raise',   muscleGroup: 'lower_leg', primaryMuscles: 'Gastrocnemius',       secondaryMuscles: 'Soleus',                               equipment: 'Calf Raise Machine / Barbell', mechanics: 'Isolation' },
  { id: 'lower_leg_1', name: 'Seated Calf Raise',     muscleGroup: 'lower_leg', primaryMuscles: 'Soleus',              secondaryMuscles: 'Gastrocnemius',                        equipment: 'Seated Calf Machine',         mechanics: 'Isolation' },
  { id: 'lower_leg_2', name: 'Leg Press Calf Raise',  muscleGroup: 'lower_leg', primaryMuscles: 'Gastrocnemius',       secondaryMuscles: 'Soleus',                               equipment: 'Leg Press Machine',           mechanics: 'Isolation' },

  // ── GLUTES ───────────────────────────────────────────────────────────
  { id: 'glutes_0', name: 'Hip Thrust',               muscleGroup: 'glutes', primaryMuscles: 'Gluteus Maximus',         secondaryMuscles: 'Hamstrings, Core',                     equipment: 'Barbell, Bench',              mechanics: 'Compound' },
  { id: 'glutes_1', name: 'Glute Bridge',             muscleGroup: 'glutes', primaryMuscles: 'Gluteus Maximus',         secondaryMuscles: 'Hamstrings',                           equipment: 'Bodyweight / Barbell',        mechanics: 'Isolation' },
  { id: 'glutes_2', name: 'Cable Kickback',           muscleGroup: 'glutes', primaryMuscles: 'Gluteus Maximus',         secondaryMuscles: 'Hamstrings',                           equipment: 'Cable Machine',               mechanics: 'Isolation' },
  { id: 'glutes_3', name: 'Sumo Deadlift',            muscleGroup: 'glutes', primaryMuscles: 'Gluteus Maximus',         secondaryMuscles: 'Quadriceps, Hamstrings',               equipment: 'Barbell',                     mechanics: 'Compound' },
  { id: 'glutes_4', name: 'Abductor Machine',         muscleGroup: 'glutes', primaryMuscles: 'Gluteus Medius',          secondaryMuscles: 'Gluteus Minimus',                      equipment: 'Abductor Machine',            mechanics: 'Isolation' },
];

// Build final typed exercises array
export const exercises: Exercise[] = rawExercises.map(e => ({
  ...e,
  mechanics: e.mechanics as Exercise['mechanics'],
  tutorial: buildTutorial(e.name, e.mechanics, e.equipment),
}));

export const MUSCLE_GROUPS: { id: MuscleGroup; label: string; emoji: string }[] = [
  { id: 'chest',     label: 'Chest',     emoji: '🫁' },
  { id: 'back',      label: 'Back',      emoji: '🦴' },
  { id: 'shoulder',  label: 'Shoulders', emoji: '💪' },
  { id: 'biceps',    label: 'Biceps',    emoji: '💪' },
  { id: 'triceps',   label: 'Triceps',   emoji: '💪' },
  { id: 'core_abs',  label: 'Core / Abs', emoji: '🎯' },
  { id: 'upper_leg', label: 'Quads & Hams', emoji: '🦵' },
  { id: 'lower_leg', label: 'Calves',    emoji: '🦵' },
  { id: 'glutes',    label: 'Glutes',    emoji: '🍑' },
];

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}

export function getExercisesByMuscleGroup(group: MuscleGroup): Exercise[] {
  return exercises.filter(e => e.muscleGroup === group);
}

export function searchExercises(query: string): Exercise[] {
  const q = query.toLowerCase();
  return exercises.filter(
    e =>
      e.name.toLowerCase().includes(q) ||
      e.primaryMuscles.toLowerCase().includes(q) ||
      e.equipment.toLowerCase().includes(q)
  );
}
