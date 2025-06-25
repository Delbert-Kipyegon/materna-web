import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AskPage from './pages/AskPage';
import TrackerPage from './pages/TrackerPage';
import TipsPage from './pages/TipsPage';
import AffirmationsPage from './pages/AffirmationsPage';
import PrimePage from './pages/PrimePage';
import NotesPage from './pages/NotesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="ask" element={<AskPage />} />
          <Route path="tracker" element={<TrackerPage />} />
          <Route path="tips" element={<TipsPage />} />
          <Route path="affirmations" element={<AffirmationsPage />} />
          <Route path="prime" element={<PrimePage />} />
          <Route path="notes" element={<NotesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;