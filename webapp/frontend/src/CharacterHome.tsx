import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { characters } from './characters';
import { imageMap, fallbackImage } from './images';
import { themeByImage } from './theme';

const XP_PER_LEVEL = 100; // сколько XP нужно на уровень

// ключи локального хранилища
const xpKey = (id: string) => `lvlup_xp_${id}`;

export default function CharacterHome() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);

  // статы из localStorage
  const [xp, setXp] = useState(0);

  useEffect(() => {
    if (!c) return;
    const raw = localStorage.getItem(xpKey(c.id));
    setXp(raw ? Math.max(0, Number(raw)) : 0);
  }, [c?.id]);

  const { level, progress, pct } = useMemo(() => {
    const lvl = Math.floor(xp / XP_PER_LEVEL) + 1;
    const prog = xp % XP_PER_LEVEL;
    const percent = Math.round((prog / XP_PER_LEVEL) * 100);
    return { level: lvl, progress: prog, pct: percent };
  }, [xp]);

  if (!c) {
    return (
      <div className="min-h-screen p-6 grid place-items-center">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-bold">Персонаж не найден</h1>
          <Link to="/choiceperson" className="text-blue-600 hover:underline">Назад к выбору</Link>
        </div>
      </div>
    );
  }

  const t = themeByImage[c.image];
  const baseSrc = imageMap[c.image] ?? fallbackImage;
  // если у тебя есть альтернативная картинка для бизнес — подставится; иначе вернётся baseSrc
  const src = c.id === 'business' ? (imageMap['businessAlt'] ?? baseSrc) : baseSrc;

  // для «Бизнес» — свечение максимально белое; для остальных — из темы
  const layer2 = c.id === 'business' ? 'rgba(255,255,255,0.92)' : t.haloTo;
  const layer3 = c.id === 'business' ? 'rgba(255,255,255,0.85)' : t.haloFrom;

  return (
    <div className='flex items-center'>
    <div className="min-h-screen p-4">
      <div className="mb-3">
        <Link to="/choiceperson" className="text-sm text-gray-600 hover:underline">‹ Назад</Link>
      </div>

      {/* Геро-блок со свечением строго внутри контейнера */}
      <div
        className="relative mb-3 grid place-items-center h-[540px] rounded-3xl overflow-hidden isolate px-4"
        style={{
          background: `
            radial-gradient(closest-side at 50% 40%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0) 58%),
            radial-gradient(closest-side at 50% 42%, ${layer2} 0%, rgba(255,255,255,0) 75%),
            radial-gradient(closest-side at 50% 45%, ${layer3} 0%, rgba(255,255,255,0) 95%)
          `
        }}
      >
        <img src={src} alt={c.name} className="relative z-10 w-80 h-80 object-contain" />

        {/* Уровень + прогресс XP — теперь у всех персонажей */}
        <div className="relative z-10 mt-2 text-center px-4 w-full max-w-md">
          <div className="text-2xl font-bold text-gray-900">Уровень {level}</div>

          <div className="mt-3">
            <div className="h-2.5 w-full rounded-full bg-gray-200/80">
              <div
                className="h-2.5 rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${t.btnFrom}, ${t.btnTo})`
                }}
              />
            </div>
            <div className="mt-1 text-xs text-gray-700">{progress} XP / {XP_PER_LEVEL} XP</div>
          </div>
        </div>
      </div>

      {/* Кнопки (оставил как у тебя) */}
      <div className="flex flex-col items-center gap-5 max-w-md mx-auto">
        <div className="flex gap-4 justify-center w-full">
          <Link
            to={`/character/${c.id}/tasks`}
            className="flex-1 max-w-[130px] rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`, boxShadow: `0 8px 20px ${t.btnFrom}80` }}
          >
            Задачи
          </Link>
          <Link
            to={`/character/${c.id}/stats`}
            className="flex-1 max-w-[130px] rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`, boxShadow: `0 8px 20px ${t.btnTo}80` }}
          >
            Цели
          </Link>
          <Link
            to={`/character/${c.id}/stats`}
            className="flex-1 max-w-[130px] rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`, boxShadow: `0 8px 20px ${t.btnFrom}80` }}
          >
            Статистика
          </Link>
        </div>

        <div className="flex gap-4 justify-center w-full">
          <Link
            to={`/character/${c.id}/timer`}
            className="flex-1 max-w-[140px] rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] flex items-center justify-center "
            style={{ background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`, boxShadow: `0 8px 20px ${t.btnTo}80` }}
          >
            Таймер
          </Link>
          <Link
            to={`/character/${c.id}/stats`}
            className="flex-1 max-w-[150px] rounded-[50px] h-12 shadow-lg active:scale-95 transition text-white text-[14px] flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${t.btnTo}, ${t.btnFrom})`, boxShadow: `0 8px 20px ${t.btnTo}80` }}
          >
            Дополнительно
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}