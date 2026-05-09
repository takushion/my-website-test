import React, { Suspense, lazy, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MazeCanvas from './components/MazeCanvas/MazeCanvas';
import MainLayout from './components/layouts/MainLayout';
import type { AppPhase } from './components/maze/types';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const [uiShown, setUiShown] = useState(false);

  const handlePhaseChange = useCallback((newPhase: AppPhase) => {
    if (newPhase !== "INIT") {
      setUiShown(true);
    }
  }, []);

  const showUI = uiShown;

  return (
    <BrowserRouter>
      <MazeCanvas onPhaseChange={handlePhaseChange} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          opacity: showUI ? 1 : 0,
          transition: "opacity 0.6s ease-in",
          pointerEvents: showUI ? "auto" : "none",
        }}
      >
        <Suspense fallback={<div />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
