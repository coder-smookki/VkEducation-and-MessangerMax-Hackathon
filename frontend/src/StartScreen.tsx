import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame } from './http';

export default function StartScreen() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartGame = async () => {
    setLoading(true);

    try {
      const userId = '123'; // здесь можно получить реальный user_id после авторизации
      const result = await startGame(userId);
      
      console.log('Ответ от сервера:', result);
      
      if (result.success) {
        navigate('/choiceperson');
      } else {
        alert('Не удалось зарегистрировать игрока.');
      }
    } catch (err) {
      alert('Ошибка при подключении к серверу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-9">Level Up Life</h1>
        <button
          onClick={handleStartGame}
          disabled={loading}
          className="block w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : 'Начать игру'}
        </button>
      </div>
    </div>
  );
}
