import { Link } from 'react-router-dom';

export default function StartScreen() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-9">Level Up Life</h1>
        <Link
          to="/choiceperson"
          className="block w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white hover:opacity-90"
        >
          Начать игру
        </Link>
      </div>
    </div>
  );
}