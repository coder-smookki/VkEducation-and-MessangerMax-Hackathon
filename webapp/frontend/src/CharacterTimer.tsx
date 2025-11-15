// src/CharacterTimer.tsx
import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { characters } from './characters';
import { themeByImage } from './theme';

type Mode = 'focus' | 'short' | 'long';

type Settings = {
  focus: number;   // сек
  short: number;   // сек
  long: number;    // сек
  longEvery: number; // длинный перерыв каждые N фокусов
};

const DEFAULT: Settings = { focus: 25 * 60, short: 5 * 60, long: 15 * 60, longEvery: 4 };

const setKey = (charId: string) => `pomodoro_settings_${charId}`;
const stKey  = (charId: string) => `pomodoro_state_${charId}`;
const xpKey  = (charId: string) => `lvlup_xp_${charId}`;

const XP_PER_MINUTE = 1;
const STREAK_BONUS  = 5;

function fmt(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function loadXp(charId: string): number {
  const raw = localStorage.getItem(xpKey(charId));
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

function saveXp(charId: string, xp: number) {
  localStorage.setItem(xpKey(charId), String(Math.max(0, Math.floor(xp))));
}

export default function CharacterTimer() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);

  if (!c) {
    return (
      <div className="min-h-screen px-4 py-5 grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-[400px] text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Таймер не найден</h1>
          <p className="text-gray-600 mb-6">Такого персонажа не существует</p>
          <Link 
            to="/choiceperson" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            ← Выбрать персонажа
          </Link>
        </div>
      </div>
    );
  }

  const theme = themeByImage[c.image];

  const [settings, setSettings] = useState<Settings>(DEFAULT);
  useEffect(() => {
    const raw = localStorage.getItem(setKey(c.id));
    if (raw) {
      try { setSettings({ ...DEFAULT, ...(JSON.parse(raw) as Partial<Settings>) }); }
      catch {}
    }
  }, [c.id]);
  
  const saveSettings = (next: Settings) => {
    setSettings(next);
    localStorage.setItem(setKey(c.id), JSON.stringify(next));
  };

  const [mode, setMode] = useState<Mode>('focus');
  const [left, setLeft] = useState<number>(DEFAULT.focus);
  const [running, setRunning] = useState(false);
  const [focusCount, setFocusCount] = useState(0);

  const [xp, setXp] = useState<number>(0);
  const [lastGain, setLastGain] = useState<number>(0);

  useEffect(() => {
    const raw = localStorage.getItem(stKey(c.id));
    if (!raw) {
      setLeft(settings.focus);
    } else {
      try {
        const s = JSON.parse(raw) as { mode: Mode; left: number; running: boolean; focusCount: number; };
        setMode(s.mode ?? 'focus');
        setLeft(s.left ?? settings.focus);
        setRunning(false);
        setFocusCount(s.focusCount ?? 0);
      } catch {
        setLeft(settings.focus);
      }
    }
    setXp(loadXp(c.id));
  }, [c.id, settings.focus]);

  useEffect(() => {
    localStorage.setItem(stKey(c.id), JSON.stringify({ mode, left, running, focusCount }));
  }, [c.id, mode, left, running, focusCount]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);

  const awardXp = (gain: number) => {
    if (gain <= 0) return;
    const next = Math.max(0, xp + gain);
    setXp(next);
    saveXp(c.id, next);
    setLastGain(gain);
    window.setTimeout(() => setLastGain(0), 2200);
  };

  useEffect(() => {
    if (!running) return;
    if (left > 0) return;

    setRunning(false);

    setTimeout(() => {
      if (mode === 'focus') {
        const baseGain = Math.max(1, Math.round((settings.focus / 60) * XP_PER_MINUTE));
        const nextFocusCount = focusCount + 1;
        const bonus = nextFocusCount % settings.longEvery === 0 ? STREAK_BONUS : 0;
        awardXp(baseGain + bonus);

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
  };

  const total = mode === 'focus' ? settings.focus : mode === 'short' ? settings.short : settings.long;
  const pct = Math.max(0, Math.min(100, Math.round(((total - left) / total) * 100)));

  const modeTitle = useMemo(() => {
    switch (mode) {
      case 'focus': return 'Фокус-сессия';
      case 'short': return 'Короткий перерыв';
      case 'long':  return 'Длинный перерыв';
    }
  }, [mode]);

  const modeDescription = useMemo(() => {
    switch (mode) {
      case 'focus': return 'Сосредоточьтесь на задаче';
      case 'short': return 'Отдохните несколько минут';
      case 'long':  return 'Время для полноценного отдыха';
    }
  }, [mode]);

  // Цвета для разных режимов
  const modeColors = useMemo(() => {
    switch (mode) {
      case 'focus': 
        return {
          primary: theme.btnFrom,
          secondary: theme.btnTo,
          bg: `linear-gradient(135deg, ${theme.haloFrom}15, ${theme.haloTo}15)`,
          glow: `0 20px 40px ${theme.btnFrom}30`
        };
      case 'short':
        return {
          primary: '#10b981',
          secondary: '#059669',
          bg: 'linear-gradient(135deg, #10b98115, #05966915)',
          glow: '0 20px 40px rgba(16, 185, 129, 0.3)'
        };
      case 'long':
        return {
          primary: '#8b5cf6',
          secondary: '#7c3aed',
          bg: 'linear-gradient(135deg, #8b5cf615, #7c3aed15)',
          glow: '0 20px 40px rgba(139, 92, 246, 0.3)'
        };
    }
  }, [mode, theme]);

  return (
    <div className="min-h-screen px-4 py-5 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-[400px] mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between p-4 rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-white/20">
          <Link
            to={`/character/${c.id}`}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs">
              ←
            </div>
            <span>Назад</span>
          </Link>
      
        </div>

        {/* Timer Card */}
        <div 
          className="rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden backdrop-blur border border-white/20 mb-6"
          style={{ 
            background: modeColors.bg,
            boxShadow: modeColors.glow
          }}
        >
          {/* Progress Ring */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={modeColors.primary}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 - (282.7 * pct) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[48px] font-bold text-gray-800 mb-2 leading-none">
                {fmt(left)}
              </div>
              <div className="text-sm text-gray-600">{modeDescription}</div>
            </div>

            {/* XP Badge */}
            {lastGain > 0 && (
              <div 
                className="absolute -top-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-semibold text-white animate-bounce"
                style={{ 
                  background: `linear-gradient(135deg, ${modeColors.primary}, ${modeColors.secondary})`,
                  boxShadow: `0 8px 20px ${modeColors.primary}50`
                }}
              >
                +{lastGain} XP! 🎉
              </div>
            )}
          </div>

          {/* Mode Title */}
          <div className="mb-6">
            <div 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-bold text-white"
              style={{ 
                background: `linear-gradient(135deg, ${modeColors.primary}, ${modeColors.secondary})`,
                boxShadow: `0 8px 25px ${modeColors.primary}40`
              }}
            >
              <span className={
                mode === 'focus' ? 'animate-pulse' : 
                mode === 'short' ? 'animate-bounce' : 'animate-pulse'
              }>
                {mode === 'focus' ? '🎯' : mode === 'short' ? '☕' : '🌴'}
              </span>
              {modeTitle}
            </div>
          </div>

          {/* Progress Stats */}
          <div className="flex justify-center items-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {focusCount % settings.longEvery}
              </div>
              <div className="text-xs text-gray-600">Фокусов</div>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {settings.longEvery}
              </div>
              <div className="text-xs text-gray-600">До перерыва</div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={reset}
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-lg"
              title="Сброс"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button
              onClick={startPause}
              className="flex-1 h-14 rounded-xl text-white font-bold text-lg active:scale-95 transition-all shadow-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${modeColors.primary}, ${modeColors.secondary})`,
                boxShadow: `0 12px 30px ${modeColors.primary}50`
              }}
            >
              {running ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  Пауза
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Старт
                </span>
              )}
            </button>

            <button
              onClick={skip}
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-lg"
              title="Далее"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-2xl p-6 shadow-xl bg-white/90 backdrop-blur border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white">
              ⚙️
            </div>
            <h3 className="text-lg font-bold text-gray-800">Настройки таймера</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фокус (мин)
              </label>
              <input
                type="number" 
                min={1} 
                max={180}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
                defaultValue={Math.round(settings.focus / 60)}
                onChange={(e) => {
                  const v = Math.max(1, Number(e.target.value) || 1) * 60;
                  saveSettings({ ...settings, focus: v });
                  if (mode === 'focus' && !running) setLeft(v);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Короткий (мин)
              </label>
              <input
                type="number" 
                min={1} 
                max={60}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
                defaultValue={Math.round(settings.short / 60)}
                onChange={(e) => {
                  const v = Math.max(1, Number(e.target.value) || 1) * 60;
                  saveSettings({ ...settings, short: v });
                  if (mode === 'short' && !running) setLeft(v);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Длинный (мин)
              </label>
              <input
                type="number" 
                min={1} 
                max={120}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
                defaultValue={Math.round(settings.long / 60)}
                onChange={(e) => {
                  const v = Math.max(1, Number(e.target.value) || 1) * 60;
                  saveSettings({ ...settings, long: v });
                  if (mode === 'long' && !running) setLeft(v);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Длинный через
              </label>
              <input
                type="number" 
                min={2} 
                max={12}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
                defaultValue={settings.longEvery}
                onChange={(e) => {
                  const v = Math.max(2, Number(e.target.value) || 4);
                  saveSettings({ ...settings, longEvery: v });
                }}
              />
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            * Длинный перерыв наступает каждые {settings.longEvery} фокус-сессий
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}