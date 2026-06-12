import { useParams, useNavigate } from 'react-router-dom';
import { PlanBuilder } from '@/components/plan/PlanBuilder';
import { usePlanStore } from '@/store/usePlanStore';

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const plans = usePlanStore((s) => s.plans);

  // If there's an ID, find the plan. Otherwise, we are creating a new one.
  const isEdit = !!id;
  const initialPlan = isEdit ? plans.find((p) => p.id === id) : undefined;

  if (isEdit && !initialPlan) {
    return (
      <div className="text-center py-20 text-white/50 flex flex-col gap-4">
        <span>Plan not found.</span>
        <button
          onClick={() => navigate('/plans')}
          className="text-accent hover:underline text-sm font-semibold"
        >
          Go Back to Plans
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          {isEdit ? 'Edit Workout Plan' : 'Create Workout split'}
        </h1>
        <p className="text-xs text-white/40 mt-1">
          {isEdit
            ? 'Adjust training days, customize default repetitions, weights and targets.'
            : 'Build a custom training split and structure set volume targets.'}
        </p>
      </div>

      <PlanBuilder initialPlan={initialPlan} />
    </div>
  );
}
