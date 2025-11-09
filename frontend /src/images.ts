import programmer from './assets/programmer.png';
import business from './assets/clen.png'; 
import fil from './assets/image.png'; 
import foot from './assets/foot.png';
import businessAlt from './assets/b1.png';

export const imageMap = { programmer, business, fil, foot, businessAlt};
export type ImageKey = keyof typeof imageMap;
export const fallbackImage = programmer;
