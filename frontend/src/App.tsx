// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { initAuthFromWebApp } from './auth.ts';

import StartScreen from './StartScreen';
import CharacterSelect from './CharacterSelect';
import CharacterHome from './CharacterHome';
import CharacterTasks from './CharacterTasks';

import CharacterTimer from './CharacterTimer';

export default function App() {
  useEffect(() => { initAuthFromWebApp().catch(() => {}); }, []); // пытаемся получить user_id из InitData
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/choiceperson" element={<CharacterSelect />} />
      <Route path="/character/:id" element={<CharacterHome />} />
      <Route path="/character/:id/tasks" element={<CharacterTasks />} />
      <Route path="/character/:id/timer" element={<CharacterTimer />} />
    </Routes>
  );
}