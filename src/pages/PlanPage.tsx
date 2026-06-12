import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PlanCard } from '@/components/plan/PlanCard';
import { usePlanStore } from '@/store/usePlanStore';

export default function PlanPage() {
  const navigate = useNavigate();
  const { plans, loaded, loadPlans } = usePlanStore();

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Workout Plans</h1>
          <p className="text-xs text-white/40 mt-1">Structure your training splits, sets, and progression targets.</p>
        </div>
        <button
          onClick={() => navigate('/plans/new')}
          className="w-10 h-10 rounded-xl bg-accent text-black font-black flex items-center justify-center shadow-glow-green active:scale-95 transition-all shrink-0"
          aria-label="Create Plan"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Plans List */}
      {!loaded ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 px-4 bg-white/3 border border-white/5 rounded-3xl border-dashed">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/40">
            <ClipboardList className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-white text-base">Create Your First split</h3>
          <p className="text-xs text-white/40 max-w-xs mt-1 mb-6">
            Build custom splits (like Push/Pull/Legs or Arnold Split) to track progressive overload.
          </p>
          <Button onClick={() => navigate('/plans/new')} variant="primary" className="py-2.5 px-6">
            Add Workout Plan
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
