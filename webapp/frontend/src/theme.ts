// theme.ts
import type { ImageKey } from './images';

export type CardTheme = {
  haloFrom: string;
  haloTo: string;
  btnFrom: string;
  btnTo: string;
  btnText: 'black' | 'white';
};

export const themeByImage: Record<ImageKey, CardTheme> = {
  programmer: {
    haloFrom: '#8478f6ff', haloTo: '#FFFFFF',
    btnFrom: '#6C63FF', btnTo: '#7B61FF',
    btnText: 'white',
  },
  business: {
    haloFrom: '#d0bdbdff', haloTo: '#FFFFFF', // ИЗМЕНИЛ на белые тона
    btnFrom: '#808080', btnTo: '#404040',   // Серые кнопки вместо оранжевых
    btnText: 'white',
  },
  fil: {
    haloFrom: '#f499e8ff', haloTo: '#FFFFFF',
    btnFrom: '#f499e8ff', btnTo: '#f63ba2ff',
    btnText: 'white',
  },
  foot: {
    haloFrom: '#75d1f6ff', haloTo: '#FFFFFF',
    btnFrom: '#72e8faff', btnTo: '#3B82F6',
    btnText: 'white',
  }, 
  businessAlt: {
    haloFrom: '#F0F0F0', haloTo: '#FFFFFF', // Тоже белые тона
    btnFrom: '#808080', btnTo: '#404040',
    btnText: 'white',
  }, 
};