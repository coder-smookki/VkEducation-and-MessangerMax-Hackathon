import { imageMap, fallbackImage, type ImageKey } from './images';
import { themeByImage } from './theme';

type CharacterVM = {
  id: string;
  name: string;
  image: ImageKey;
  story: string;
};

type Props = {
  character: CharacterVM;
  isActive: boolean;
  onSelect: () => void;
  onChoose: () => void;
};

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
        'group relative w-full h-[590px] bg-transparent', 
        'flex flex-col items-center justify-start pb-3',
        'transition-transform duration-300',
        isActive ? 'scale-100' : 'scale-[0.98] opacity-95',
        'hover:scale-105'
      ].join(' ')}
      role="button"
      tabIndex={0}
    >
    
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle closest-side at 50% 38%, ${t.haloFrom} 0%, ${t.haloTo} 100%)`
        
        }}
      />

      {/* картинка */}
      <div className="flex-1 w-full grid place-items-center">
        <img
          src={src}
          alt={character.name}
          loading="lazy"
          className="w-72 h-72 object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* имя + история */}
      <div className="text-center">
        <div className="text-[17px] text-center font-semibold text-gray-900 mb-[">{character.name}</div>
        <p className="text-gray-700 text-[12px] ">{character.story}</p>
      </div>

      {/* кнопка выбрать (свои цвета) */}
      <div className="mt-6 mb-4"> {/* увеличили отступы */}
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