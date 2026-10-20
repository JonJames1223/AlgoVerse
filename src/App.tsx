import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { PreferencesProvider } from './hooks/PreferencesProvider';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { SortingLab } from './pages/SortingLab';
import { NotFound, Roadmap } from './pages/Roadmap';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <PreferencesProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="sorting" element={<Navigate to="/sorting/bubble" replace />} />
                <Route path="sorting/:algorithm" element={<SortingLab />} />
                <Route path="roadmap/:topic" element={<Roadmap />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PreferencesProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
