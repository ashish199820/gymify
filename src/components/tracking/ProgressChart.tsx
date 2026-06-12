import { useMemo } from 'react';
import { getExerciseProgress } from '@/lib/progressUtils';
import { format } from 'date-fns';
import type { WorkoutSession } from '@/lib/types';

interface ProgressChartProps {
  sessions: WorkoutSession[];
  exerciseId: string;
}

export function ProgressChart({ sessions, exerciseId }: ProgressChartProps) {
  const data = useMemo(() => {
    const progress = getExerciseProgress(sessions, exerciseId);
    // Sort chronological for charting
    return progress.sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sessions, exerciseId]);

  if (data.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-white/40">
        No stats logged for this exercise yet. Complete a workout to see progression!
      </div>
    );
  }

  // Mini Chart Calculations
  const weights = data.map((d) => d.maxWeight);
  const maxWeight = Math.max(...weights, 10);
  const minWeight = Math.min(...weights, 0);
  const range = maxWeight - minWeight;

  return (
    <div className="flex flex-col gap-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
          <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block mb-1">
            Personal Best
          </span>
          <span className="text-xl font-black text-white">{Math.max(...weights)} kg</span>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
          <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block mb-1">
            Last Session Vol
          </span>
          <span className="text-xl font-black text-accent">
            {data[data.length - 1]?.totalVolume || 0} kg
          </span>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-4">
          Max Weight Over Time
        </span>

        <div className="relative h-36 w-full flex items-end">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

            {/* Sparkline */}
            <polyline
              fill="none"
              stroke="#a3e635"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data
                .map((d, index) => {
                  const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 50;
                  const y = 90 - ((d.maxWeight - minWeight) / (range || 1)) * 70;
                  return `${x},${y}`;
                })
                .join(' ')}
            />

            {/* Glowing gradient under line */}
            <polygon
              fill="url(#chart-grad)"
              points={`0,100 ${data
                .map((d, index) => {
                  const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 50;
                  const y = 90 - ((d.maxWeight - minWeight) / (range || 1)) * 70;
                  return `${x},${y}`;
                })
                .join(' ')} 100,100`}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a3e635" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#a3e635" stopOpacity="0.0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Value Bubbles overlay */}
          <div className="absolute inset-0 flex justify-between pointer-events-none items-end px-1.5 pb-2">
            {data.map((d, i) => (
              <span key={i} className="text-[9px] text-white/50 font-bold bg-[#151515] border border-white/5 px-1 py-0.5 rounded shadow">
                {d.maxWeight}k
              </span>
            ))}
          </div>
        </div>

        {/* Date Labels */}
        <div className="flex justify-between items-center mt-3 text-[10px] text-white/30 font-medium">
          <span>{format(new Date(data[0].date), 'MMM d')}</span>
          {data.length > 2 && (
            <span>{format(new Date(data[Math.floor(data.length / 2)].date), 'MMM d')}</span>
          )}
          <span>{format(new Date(data[data.length - 1].date), 'MMM d')}</span>
        </div>
      </div>
    </div>
  );
}
