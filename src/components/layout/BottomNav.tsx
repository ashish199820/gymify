import { useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, ClipboardList, Play, User, Trophy } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/exercises',   label: 'Exercises',  Icon: Dumbbell },
  { path: '/plans',       label: 'Plans',      Icon: ClipboardList },
  { path: '/track',       label: 'Track',      Icon: Play },
  { path: '/leaderboard', label: 'Rank',       Icon: Trophy },
  { path: '/profile',     label: 'Profile',    Icon: User },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, label, Icon }) => {
        const active = pathname.startsWith(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={clsx('nav-item', active && 'active')}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <div className="relative">
              <Icon
                className={clsx(
                  'nav-icon w-5 h-5',
                  active ? 'text-accent' : 'text-white/40'
                )}
                strokeWidth={active ? 2.5 : 1.8}
              />
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -inset-1.5 rounded-lg bg-accent/10 -z-10"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
            </div>
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
