import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './store/useUserStore';
import { AppShell } from './components/layout/AppShell';

// Pages
import Landing from './pages/Landing';
import ExercisesPage from './pages/ExercisesPage';
import PlanPage from './pages/PlanPage';
import PlanDetailPage from './pages/PlanDetailPage';
import TrackPage from './pages/TrackPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';

// Protected Route Guard
function RouteGuard({ children }: { children: React.ReactNode }) {
  const isOnboarded = useUserStore((s) => s.isOnboarded);
  if (!isOnboarded) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const isOnboarded = useUserStore((s) => s.isOnboarded);

  return (
    <Router>
      <Routes>
        {/* Landing / Onboarding page */}
        <Route
          path="/"
          element={isOnboarded ? <Navigate to="/exercises" replace /> : <Landing />}
        />

        {/* Dashboard Layout sub-routes */}
        <Route
          element={
            <RouteGuard>
              <AppShell />
            </RouteGuard>
          }
        >
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/plans" element={<PlanPage />} />
          <Route path="/plans/new" element={<PlanDetailPage />} />
          <Route path="/plans/edit/:id" element={<PlanDetailPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
