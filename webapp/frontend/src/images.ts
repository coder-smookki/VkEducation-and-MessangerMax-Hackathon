// src/images.ts
import programmer from './assets/programmer.png';
import business from './assets/clen.png';
import fil from './assets/image.png';
import foot from './assets/foot.png';

// второй уровень для бизнеса
import businessAlt from './assets/b1.png';
import f1 from './assets/f1.png';
import f2 from './assets/f2.png';
import f3 from './assets/f3.png';
import f4 from './assets/f4.png';
import f5 from './assets/f5.png';
import d5 from './assets/d5.png';
import d4 from './assets/d4.png';
import d3 from './assets/d3.png';
import d2 from './assets/d2.png';
import d1 from './assets/d1.png';
import p1 from './assets/p1.png';
import p2 from './assets/p2.png';
import p3 from './assets/p3.png';
import p4 from './assets/p4.png';
import p5 from './assets/p5.png';
import b1 from './assets/b1.png';
import b2 from './assets/b2.png';
import b3 from './assets/b3.png';
import b4 from './assets/b4.png';
import b5 from './assets/b5.png';


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
  f1,f2,f3,f4,f5, d1,d2,d3,d4,d5,p1,p2,p3,p4,p5, b1, b2, b3, b4, b5
};

export type ImageKey = keyof typeof imageMap;

// дефолт (если ничего не нашлось)
export const fallbackImage = programmer;