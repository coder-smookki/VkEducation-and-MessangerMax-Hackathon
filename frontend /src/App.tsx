import { Routes, Route } from 'react-router-dom';
import StartScreen from './StartScreen';
import CharacterSelect from './CharacterSelect';
import CharacterHome from './CharacterHome';
import CharacterTasks from './CharacterTasks';
import CharacterStats from './CharacterTasks';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/choiceperson" element={<CharacterSelect />} />
      <Route path="/character/:id" element={<CharacterHome />} />
      <Route path="/character/:id/tasks" element={<CharacterTasks />} />
      <Route path="/character/:id/stats" element={<CharacterStats />} />
    </Routes>
  );
}