// src/CharacterCard.tsx
import { imageMap, fallbackImage, type ImageKey } from './images';
import { themeByImage } from './theme';

type CharacterVM = { id: string; name: string; image: ImageKey; story: string; };
type Props = { character: CharacterVM; isActive: boolean; onSelect: () => void; onChoose: () => void; };

export default function CharacterCard({ character, isActive, onSelect, onChoose }: Props) {
  const src = imageMap[character.image] ?? fallbackImage;
  const t = themeByImage[character.image];

  const btnText = t.btnText === 'white' ? 'text-white' : 'text-black';
  const btnBg = `linear-gradient(135deg, ${t.btnFrom}, ${t.btnTo})`;

  return (
    <div
      onClick={onSelect}
      title={character.name}
      className={[
        'group relative w-full max-w-[520px] md:max-w-[560px] lg:max-w-[600px]',
        'h-[460px] md:h-[480px] lg:h-[500px]',
        'grid grid-rows-[1fr_auto_auto] items-center justify-items-center gap-2',
        'bg-transparent rounded-3xl overflow-hidden',
        'px-4 py-2 md:px-5 md:py-2',
        'transition-transform duration-300',
        isActive ? 'scale-100' : 'scale-[0.98] opacity-95',
        'hover:scale-[1.02]',
      ].join(' ')}
      role="button"
      tabIndex={0}
    >
      {/* свечение (сжато по вертикали, меньше отступы сверху/снизу) */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none rounded-3xl"
        style={{
          background: `
            radial-gradient(
              ellipse 50% 20% at 50% 45%,
              ${t.haloFrom} 0%,
              ${t.haloTo} 100%
            )
          `
        }}
      />

      <div className="w-full grid place-items-center">
        <img
          src={src}
          alt={character.name}
          loading="lazy"
          className="max-h-[240px] md:max-h-[280px] lg:max-h-[300px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="w-full text-center px-2">
        <div className="text-[17px] font-semibold text-gray-900">{character.name}</div>
        <p className="text-gray-700 text-[12px] md:text-[11px] leading-snug mt-1">{character.story}</p>
      </div>

      <div>
        <button
          onClick={(e) => { e.stopPropagation(); onChoose(); }}
          className={`rounded-full px-6 py-3 font-semibold shadow-lg active:scale-95 transition ${btnText}`}
          style={{ background: btnBg }}
        >
          Выбрать
        </button>
      </div>
    </div>
  );
}