// src/CharacterSelect.tsx
import { type UIEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { characters } from './characters';
import CharacterCard from './CharacterCard';
import { themeByImage } from './theme';
import type { ImageKey } from './images';
import { saveGlow } from './http';

// #RRGGBB -> rgba
function hexToRgba(hex: string, alpha = 1): string {
  const m = hex.replace('#', '');
  const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getGlowForImage(img: ImageKey) {
  const t = themeByImage[img];
  const haloFrom = t?.haloFrom ?? hexToRgba(t.btnFrom, 0.35);
  const haloTo   = t?.haloTo   ?? hexToRgba(t.btnTo,   0.10);
  return { haloFrom, haloTo };
}

export default function CharacterSelect() {
  const nav = useNavigate();
  const [active, setActive] = useState(0);
  const count = characters.length;

  const next = () => setActive(v => Math.min(count - 1, v + 1));
  const prev = () => setActive(v => Math.max(0, v - 1));

  const blockScroll = (e: UIEvent | WheelEvent | TouchEvent) => {
    e.preventDefault?.();
    // @ts-expect-error
    e.returnValue = false;
  };

  return (
    <div className="min-h-[620px] grid place-items-center px-4 py-6 md:py-4">
      <div className="w-full max-w-[920px]">
        <h1 className="mb-4 md:mb-4 text-center text-[18px] md:text-[20px] tracking-[0.08em] font-semibold text-gray-900 uppercase">
          Выбор персонажа
        </h1>

        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
          <button className="rounded-full w-9 h-9 grid place-items-center text-gray-500 hover:text-gray-800 disabled:opacity-40"
                  onClick={prev} aria-label="Назад" disabled={active === 0}>‹</button>

          <div className="relative overflow-hidden" onWheel={blockScroll as any} onTouchMove={blockScroll as any}>
            <div className="grid [grid-auto-flow:column] [grid-auto-columns:100%] transition-transform duration-300"
                 style={{ transform: `translateX(-${active * 100}%)` }}>
              {characters.map((c, i) => (
                <div key={c.id} className="px-2">
                  <CharacterCard
                    character={c}
                    isActive={i === active}
                    onSelect={() => setActive(i)}
                    onChoose={async () => {
                      const { haloFrom, haloTo } = getGlowForImage(c.image as ImageKey);
                      try { await saveGlow(c.id, haloFrom, haloTo); } catch {}
                      nav(`/character/${c.id}`);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button className="rounded-full w-9 h-9 grid place-items-center text-gray-500 hover:text-gray-800 disabled:opacity-40"
                  onClick={next} aria-label="Вперёд" disabled={active === count - 1}>›</button>
        </div>
      </div>
    </div>
  );
}