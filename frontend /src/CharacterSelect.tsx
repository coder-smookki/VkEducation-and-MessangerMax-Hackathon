import { type UIEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { characters } from './characters';
import CharacterCard from './CharacterCard';

export default function CharacterSelect() {
  const nav = useNavigate();
  const [active, setActive] = useState(0);
  const count = characters.length;

  const next = () => setActive((v) => Math.min(count - 1, v + 1));
  const prev = () => setActive((v) => Math.max(0, v - 1));

  // блокируем колесо/свайп — листаем только стрелками
  const blockScroll = (e: UIEvent | WheelEvent | TouchEvent) => {
    e.preventDefault?.();
    // @ts-expect-error
    e.returnValue = false;
  };

  return (
    <div className="p-4 mt-[180px]">
      <h1 className="mb-2 text-center text-[22px] tracking-[0.08em] font-semibold text-gray-900 uppercase">
        Выбор персонажа
      </h1>

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <button
          className="rounded-full w-9 h-9 grid place-items-center text-gray-500 hover:text-gray-800 disabled:opacity-40"
          onClick={prev}
          aria-label="Назад"
          disabled={active === 0}
        >
          ‹
        </button>

        {/* viewport без скролла — показываем только активный слайд */}
        <div className="relative overflow-hidden" onWheel={blockScroll as any} onTouchMove={blockScroll as any}>
          <div
            className="grid [grid-auto-flow:column] [grid-auto-columns:100%] transition-transform duration-300"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {characters.map((c, i) => (
              <div key={c.id} className="px-2">
                <CharacterCard
                  character={c}
                  isActive={i === active}
                  onSelect={() => setActive(i)}
                  onChoose={() => nav(`/character/${c.id}`)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className="rounded-full w-9 h-9 grid place-items-center text-gray-500 hover:text-gray-800 disabled:opacity-40"
          onClick={next}
          aria-label="Вперёд"
          disabled={active === count - 1}
        >
          ›
        </button>
      </div>
    </div>
  );
}