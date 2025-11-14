import { useParams, Link } from 'react-router-dom';
import { characters } from './characters';
import { imageMap, fallbackImage } from './images';

export default function CharacterPage() {
  const { id } = useParams();
  const c = characters.find(x => x.id === id);

  if (!c) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-bold">Персонаж не найден</h1>
          <Link to="/choiceperson" className="text-blue-600 hover:underline">
            Назад к выбору
          </Link>
        </div>
      </div>
    );
  }

  const src = imageMap[c.image] ?? fallbackImage;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <img
        src={src}
        alt={c.name}
        className="max-w-full max-h-[70vh] object-contain"
      />
    </div>
  );
}