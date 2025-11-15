import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame, getUserIdFromMAX } from './http';
import startScreenImage from './assets/hab.png';

export default function StartScreen() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartGame = async () => {
    setLoading(true);
    try {
      // const userId = getUserIdFromMAX(); 
      const userId = '123'
      if (!userId) {
        alert('Не удалось получить user_id из MAX');
        return;
      }

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
    <div className="min-h-screen text-gray-900 flex flex-col bg-[#FFFFFF] items-center justify-center p-4">
      <div className="text-center">
        <img src={startScreenImage} alt="Start screen" />
        <div className='text-[#909090] leading-[0.8] text-[15px]'>Заводи привычки.</div>
        <div className='text-[#909090] mb-[100px] text-[15px]'>Повышай уровень.</div>
        <button
          onClick={handleStartGame}
          disabled={loading}
          className="flex items-center justify-center text-[26px] w-full w-[240px] h-[66px] rounded-[50px] px-4 py-3 font-light text-white hover:opacity-90 disabled:opacity-50 transition-all duration-300 active:scale-95 mt-8"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 10px 70px rgba(105, 130, 239, 0.65), 0 0 80px rgba(209, 134, 246, 0.94), 0 0 100px rgba(102, 126, 234, 0.2)'
          }}
        >
          {loading ? 'Загрузка...' : 'Начать игру'}
        </button>
      </div>
    </div>
  );
}