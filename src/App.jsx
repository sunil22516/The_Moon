import React, { useState } from 'react';
import './styles/globals.css';
import './styles/animations.css';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  if (!isAuthed) {
    return <AuthPage onSkip={() => setIsAuthed(true)} />;
  }

  return <FeedPage />;
}
