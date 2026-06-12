import clsx from 'clsx';

type Variant = 'green' | 'gray' | 'gold' | 'lime' | 'blue' | 'red';

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const variantClass: Record<Variant, string> = {
  green: 'badge-green',
  gray:  'badge-gray',
  gold:  'badge-gold',
  lime:  'badge-lime',
  blue:  'badge-blue',
  red:   'badge bg-red-900/40 text-red-300 border border-red-700/30',
};

export function Badge({ variant = 'gray', children, className, style }: BadgeProps) {
  return (
    <span className={clsx(variantClass[variant], className)} style={style}>
      {children}
    </span>
  );
}
