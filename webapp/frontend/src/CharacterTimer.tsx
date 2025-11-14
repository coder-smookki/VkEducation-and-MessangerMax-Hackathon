import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { characters } from './characters';
import { themeByImage } from './theme';

type Mode = 'focus' | 'short' | 'long';

type Settings = {
  focus: number; // сек
  short: number; // сек
  long: number;  // сек
  longEvery: number; // длинный перерыв каждые N фокусов
};

const DEFAULT: Settings = { focus: 25 * 60, short: 5 * 60, long: 15 * 60, longEvery: 4 };

const setKey = (charId: string) => `pomodoro_settings_${charId}`;
const stKey  = (charId: string) => `pomodoro_state_${charId}`;

function fmt(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function CharacterTimer() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);

  // --- базовые проверки
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

  const theme = themeByImage[c.image];

  // --- настройки (с персистом)
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  useEffect(() => {
    const raw = localStorage.getItem(setKey(c.id));
    if (raw) {
      try { setSettings({ ...DEFAULT, ...JSON.parse(raw) as Partial<Settings> }); }
      catch {}
    }
  }, [c.id]);
  const saveSettings = (next: Settings) => {
    setSettings(next);
    localStorage.setItem(setKey(c.id), JSON.stringify(next));
  };

  // --- состояние таймера (с персистом)
  const [mode, setMode] = useState<Mode>('focus');
  const [left, setLeft] = useState<number>(DEFAULT.focus);
  const [running, setRunning] = useState(false);
  const [focusCount, setFocusCount] = useState(0); // сколько фокусов выполнено в текущем цикле

  // инициализация из стейта, если есть
  useEffect(() => {
    const raw = localStorage.getItem(stKey(c.id));
    if (!raw) {
      setLeft(settings.focus);
      return;
    }
    try {
      const s = JSON.parse(raw) as { mode: Mode; left: number; running: boolean; focusCount: number; };
      setMode(s.mode ?? 'focus');
      setLeft(s.left ?? settings.focus);
      setRunning(false); // безопаснее не автозапускать старый ран
      setFocusCount(s.focusCount ?? 0);
    } catch {
      setLeft(settings.focus);
    }
  }, [c.id, settings.focus]);

  // сохраняем прогресс
  useEffect(() => {
    localStorage.setItem(stKey(c.id), JSON.stringify({ mode, left, running, focusCount }));
  }, [c.id, mode, left, running, focusCount]);

  // ход таймера
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setLeft(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  // переходы между режимами
  useEffect(() => {
    if (!running) return;
    if (left > 0) return;

    // остановим, затем переключим режим и запустим заново
    setRunning(false);

    setTimeout(() => {
      if (mode === 'focus') {
        const nextFocusCount = focusCount + 1;
        setFocusCount(nextFocusCount);
        if (nextFocusCount % settings.longEvery === 0) {
          setMode('long');
          setLeft(settings.long);
        } else {
          setMode('short');
          setLeft(settings.short);
        }
      } else {
        setMode('focus');
        setLeft(settings.focus);
      }
      setRunning(true);
    }, 50);
  }, [left, running, mode, focusCount, settings.focus, settings.short, settings.long, settings.longEvery]);

  // утилиты
  const startPause = () => setRunning(r => !r);
  const reset = () => {
    setRunning(false);
    setLeft(mode === 'focus' ? settings.focus : mode === 'short' ? settings.short : settings.long);
  };
  const skip = () => {
    setRunning(false);
    if (mode === 'focus') {
      const nextFocusCount = focusCount + 1;
      setFocusCount(nextFocusCount);
      if (nextFocusCount % settings.longEvery === 0) {
        setMode('long'); setLeft(settings.long);
      } else {
        setMode('short'); setLeft(settings.short);
      }
    } else {
      setMode('focus'); setLeft(settings.focus);
    }
  };

  // прогресс в %
  const total = mode === 'focus' ? settings.focus : mode === 'short' ? settings.short : settings.long;
  const pct = Math.max(0, Math.min(100, Math.round(((total - left) / total) * 100)));

  // оформление режима
  const modeTitle = useMemo(() => {
    switch (mode) {
      case 'focus': return 'Фокус';
      case 'short': return 'Короткий перерыв';
      case 'long':  return 'Длинный перерыв';
    }
  }, [mode]);

  return (
    <div className="min-h-screen p-4">
      <div className="mb-4 flex items-center justify-between">
        <Link to={`/character/${c.id}`} className="text-sm text-gray-600 hover:underline">‹ Меню персонажа</Link>
        <span className="text-sm text-gray-500">Фокусов подряд: {focusCount % settings.longEvery}/{settings.longEvery}</span>
      </div>

      {/* Карточка таймера */}
      <div
        className="rounded-3xl p-6 text-center shadow-lg"
        style={{ background: `radial-gradient(60% 60% at 50% 30%, ${theme.haloFrom} 0%, ${theme.haloTo} 100%)` }}
      >
        {/* Режим */}
        <div className="mb-2 text-gray-800 font-semibold">{modeTitle}</div>

        {/* Время */}
        <div className="text-[64px] leading-none font-bold text-gray-900">{fmt(left)}</div>

        {/* Прогресс бар */}
        <div className="mt-4">
          <div className="h-2.5 w-full rounded-full bg-gray-200/80">
            <div
              className="h-2.5 rounded-full"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${theme.btnFrom}, ${theme.btnTo})` }}
            />
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={startPause}
            className="rounded-full px-6 py-3 text-white font-semibold active:scale-95"
            style={{ background: `linear-gradient(135deg, ${theme.btnFrom}, ${theme.btnTo})` }}
          >
            {running ? 'Пауза' : 'Старт'}
          </button>
          <button
            onClick={reset}
            className="rounded-full px-6 py-3 font-semibold active:scale-95 border border-gray-300"
          >
            Сброс
          </button>
          <button
            onClick={skip}
            className="rounded-full px-6 py-3 font-semibold active:scale-95 border border-gray-300"
          >
            Далее
          </button>
        </div>
      </div>

      {/* Настройки */}
      <details className="mt-6">
        <summary className="cursor-pointer select-none text-gray-800 font-semibold">⚙ Настройки</summary>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-sm text-gray-700">
            Фокус (мин)
            <input
              type="number" min={1} max={180}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              defaultValue={Math.round(settings.focus / 60)}
              onChange={(e) => {
                const v = Math.max(1, Number(e.target.value) || 1) * 60;
                saveSettings({ ...settings, focus: v });
                if (mode === 'focus' && !running) setLeft(v);
              }}
            />
          </label>
          <label className="text-sm text-gray-700">
            Короткий (мин)
            <input
              type="number" min={1} max={60}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              defaultValue={Math.round(settings.short / 60)}
              onChange={(e) => {
                const v = Math.max(1, Number(e.target.value) || 1) * 60;
                saveSettings({ ...settings, short: v });
                if (mode === 'short' && !running) setLeft(v);
              }}
            />
          </label>
          <label className="text-sm text-gray-700">
            Длинный (мин)
            <input
              type="number" min={1} max={120}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              defaultValue={Math.round(settings.long / 60)}
              onChange={(e) => {
                const v = Math.max(1, Number(e.target.value) || 1) * 60;
                saveSettings({ ...settings, long: v });
                if (mode === 'long' && !running) setLeft(v);
              }}
            />
          </label>
          <label className="text-sm text-gray-700">
            Длинный через (фокусов)
            <input
              type="number" min={2} max={12}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              defaultValue={settings.longEvery}
              onChange={(e) => {
                const v = Math.max(2, Number(e.target.value) || 4);
                saveSettings({ ...settings, longEvery: v });
              }}
            />
          </label>
        </div>
      </details>
    </div>
  );
}