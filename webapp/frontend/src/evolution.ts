// src/evolution.ts
import { imageMap, type ImageKey } from './images';

/**
 * Необязательная явная настройка порядка вариантов для персонажа.
 * Если здесь указать массив — он берётся в точности в таком порядке.
 * Ниже уже настроен бизнес → второй уровень businessAlt.
 */
export const evolutionById: Partial<Record<string, ImageKey[]>> = {
  business: ['businessAlt'],
  // пример, если позже захочешь задать явный порядок:
  // programmer: ['programmer', 'programmerAlt', 'programmer2'],
  // filolog: ['fil', 'fil2', 'fil3'], // если id=filolog, а базовая картинка 'fil'
};

/** ранжирование для авто-поиска: base → Alt → числовые суффиксы (2,3,4…) → прочее */
function rankVariant(key: string, base: string): number {
  if (key === base) return 0;
  if (key.toLowerCase() === (base + 'alt').toLowerCase()) return 1;
  if (key.startsWith(base)) {
    const rest = key.slice(base.length);
    const m = rest.match(/(\d+)$/);
    if (m) return 10 + parseInt(m[1], 10);
  }
  return 100;
}

/**
 * Авто-поиск вариантов по базовому ключу: base, baseAlt, base2, base3, ...
 * base берём из fallback’а, чтобы не зависеть от id (если id ≠ названию ключа).
 */
function discoverVariants(baseKey: ImageKey): ImageKey[] {
  const keys = Object.keys(imageMap) as ImageKey[];
  const related = keys.filter(
    (k) => k === baseKey || k.toLowerCase().startsWith(baseKey.toLowerCase())
  );
  if (!related.length) return [baseKey];
  return related.sort((a, b) => rankVariant(a, baseKey) - rankVariant(b, baseKey));
}

/**
 * Список вариантов картинок для персонажа:
 * - если есть явная настройка evolutionById[charId] → берём её;
 * - иначе авто-поиск на основе fallback-ключа.
 */
export function imagesFor(charId: string, fallback: ImageKey): ImageKey[] {
  const explicit = evolutionById[charId];
  if (explicit?.length) return explicit;
  return discoverVariants(fallback);
}

/**
 * Картинка для уровня: меняется на КАЖДЫЙ +1 уровень циклически по массиву вариантов.
 * Пример: варианты [A,B] → lvl1=A, lvl2=B, lvl3=A, lvl4=B...
 */
export function imageForLevel(
  charId: string,
  level: number,
  fallback: ImageKey
): ImageKey {
  const variants = imagesFor(charId, fallback);
  const idx = (Math.max(1, level) - 1) % variants.length;
  return variants[idx];
}