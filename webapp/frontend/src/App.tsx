import { Routes, Route, Navigate } from 'react-router-dom';

import StartScreen from './StartScreen';
import CharacterSelect from './CharacterSelect';
import CharacterHome from './CharacterHome';
import CharacterTasks from './CharacterTasks';
import { useEffect } from 'react';
import maxReady from './maxReady';
import CharacterTimer from './CharacterTimer';
import CharacterGoals from './CharacterGoal';

export default function App() {
  useEffect(() => {
    
   requestAnimationFrame(() => maxReady());
  }, []); 
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/choiceperson" element={<CharacterSelect />} />
      <Route path="/character/:id" element={<CharacterHome />} />
      <Route path="/character/:id/tasks" element={<CharacterTasks />} />
      <Route path="/character/:id/timer" element={<CharacterTimer />} />
      <Route path="/character/:id/goals" element={<CharacterGoals />} />
 <Route path="*" element={<Navigate to="/" replace />} />    </Routes>
  );
}
