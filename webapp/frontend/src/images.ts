// src/images.ts
import programmer from './assets/programmer.png';
import business from './assets/clen.png';
import fil from './assets/image.png';
import foot from './assets/foot.png';

// второй уровень для бизнеса
import businessAlt from './assets/b1.png';

/**
 * Все доступные изображения. Добавляй новые уровни здесь:
 *   import programmerAlt from './assets/programmer_alt.png'
 *   export const imageMap = { ..., programmerAlt }
 */
export const imageMap = {
  programmer,
  business,
  fil,
  foot,
  businessAlt,
};

export type ImageKey = keyof typeof imageMap;

// дефолт (если ничего не нашлось)
export const fallbackImage = programmer;