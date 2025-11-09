// src/CharacterHome.tsx
import { Link, useParams } from 'react-router-dom';
import { characters } from './characters';
import { imageMap, fallbackImage } from './images';
import { themeByImage } from './theme';

export default function CharacterHome() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);

  if (!c) {
    return (
      <div className="min-h-screen p-6 grid place-items-center">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-bold">Персонаж не найден</h1>
          <Link to="/choiceperson" className="text-blue-600 hover:underline">
            Назад к выбору
          </Link>
        </div>
      </div>
    );
  }

  const t = themeByImage[c.image];
  const baseSrc = imageMap[c.image] ?? fallbackImage;
  const src = c.id === 'business' ? (imageMap['businessAlt'] ?? baseSrc) : baseSrc;

  // Заглушка для XP - в реальном приложении получайте из состояния
  const currentXP = 750;
  const maxXP = 1000;
  const xpPercentage = (currentXP / maxXP) * 100;
  const level = Math.floor(currentXP / 100) + 1;

  return (
    <div className="min-h-screen p-4 mt-[120px]">
      <div className="mb-4">
        <Link to="/choiceperson" className="text-sm text-gray-600 hover:underline">‹ Назад</Link>
      </div>

      {/* ГЕРО-БЛОК С БОЛЬШИМ СВЕЧЕНИЕМ */}
      <div
        className="
          relative mb-8 grid place-items-center
          h-[540px] rounded-3xl overflow-hidden isolate
          px-4 pt-8 pb-6
        "
        style={{
          // три рад.градиента: мощный белый центр + насыщённый цвет + нежный ореол
          background: `
            radial-gradient(closest-side at 50% 40%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0) 58%),
            radial-gradient(closest-side at 50% 42%, ${t.haloTo} 0%, rgba(255,255,255,0) 75%),
            radial-gradient(closest-side at 50% 45%, ${t.haloFrom} 0%, rgba(255,255,255,0) 95%)
          `
        }}
      >

        {/* КАРТИНКА ПЕРСОНАЖА */}
        <img
          src={src}
          alt={c.name}
          className="relative z-10 w-80 h-80 object-contain"
        />

        {/* ТЕКСТ ПОД КАРТИНКОЙ */}
        <div className="relative z-10 mt-6 text-center px-4">
          {c.id === 'business' ? (
            <>
              <div className="text-2xl font-bold text-gray-900 mb-4">Уровень {level}</div>
              
              {/* ПРОГРЕСС-БАР XP */}
              <div className="w-full max-w-xs mx-auto mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Прогресс</span>
                  <span>{currentXP}/{maxXP} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">{c.name}</h1>
              <p className="mt-3 text-base text-gray-700 leading-relaxed max-w-md">{c.story}</p>
              
              {/* ПРОГРЕСС-БАР ДЛЯ ВСЕХ ПЕРСОНАЖЕЙ */}
              <div className="w-full max-w-xs mx-auto mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Уровень {level}</span>
                  <span>{currentXP}/{maxXP} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* КНОПКИ - 3 сверху, 2 снизу */}
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
        {/* ВЕРХНЯЯ СТРОКА - 3 КНОПКИ */}
        <div className="flex gap-4 justify-center w-full">
          <Link
            to={`/character/${c.id}/tasks`}
            className="flex-1 max-w-[140px] rounded-[50px] h-14 shadow-lg active:scale-95 transition text-white flex items-center justify-center font-semibold"
            style={{
              background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`,
              boxShadow: `0 8px 20px ${t.btnFrom}80`
            }}
          >
            Задачи
          </Link>

          <Link
            to={`/character/${c.id}/stats`}
            className="flex-1 max-w-[140px] rounded-[50px] h-14 shadow-lg active:scale-95 transition text-white flex items-center justify-center font-semibold"
            style={{
              background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`,
              boxShadow: `0 8px 20px ${t.btnTo}80`
            }}
          >
            Цели
          </Link>

          <Link
            to={`/character/${c.id}/stats`}
            className="flex-1 max-w-[140px] rounded-[50px] h-14 shadow-lg active:scale-95 transition text-white flex items-center justify-center font-semibold"
            style={{
              background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`,
              boxShadow: `0 8px 20px ${t.btnFrom}80`
            }}
          >
            Статистика
          </Link>
        </div>

        {/* НИЖНЯЯ СТРОКА - 2 КНОПКИ */}
        <div className="flex gap-4 justify-center w-full">
          <Link
            to={`/character/${c.id}/stats`}
            className="flex-1 max-w-[160px] rounded-[50px] h-14 shadow-lg active:scale-95 transition text-white flex items-center justify-center font-semibold"
            style={{
              background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`,
              boxShadow: `0 8px 20px ${t.btnTo}80`
            }}
          >
            Таймер
          </Link>

          <Link
            to={`/character/${c.id}/stats`}
            className="flex-1 max-w-[160px] rounded-[50px] h-14 shadow-lg active:scale-95 transition text-white flex items-center justify-center font-semibold"
            style={{
              background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`,
              boxShadow: `0 8px 20px ${t.btnTo}80`
            }}
          >
            Дополнительно
          </Link>
        </div>
      </div>
    </div>
  );
}