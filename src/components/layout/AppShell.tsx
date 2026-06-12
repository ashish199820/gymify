import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { motion, AnimatePresence } from 'framer-motion';

export function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="app-shell bg-noise">
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className="page-content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
