import clsx from 'clsx';

interface ProgressBarProps {
  value: number; // 0-1
  className?: string;
  color?: 'lime' | 'gold' | 'blue' | 'red';
  size?: 'xs' | 'sm' | 'md';
  label?: string;
}

const colorClass = {
  lime: 'from-accent to-brand-400',
  gold: 'from-gold to-amber-500',
  blue: 'from-blue-400 to-cyan-400',
  red:  'from-red-400 to-rose-500',
};

const sizeClass = { xs: 'h-1', sm: 'h-1.5', md: 'h-2' };

export function ProgressBar({ value, className, color = 'lime', size = 'md', label }: ProgressBarProps) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-white/40">{label}</span>
          <span className="text-xs text-white/60 font-medium">{pct}%</span>
        </div>
      )}
      <div className={clsx('xp-bar', sizeClass[size])}>
        <div
          className={clsx('xp-bar-fill', `bg-gradient-to-r ${colorClass[color]}`)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
