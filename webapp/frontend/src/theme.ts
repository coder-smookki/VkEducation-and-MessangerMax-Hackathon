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
    haloFrom: '#ff6565ff', haloTo: '#FFFFFF', // ИЗМЕНИЛ на белые тона
    btnFrom: '#808080', btnTo: '#404040',   // Серые кнопки вместо оранжевых
    btnText: 'white',
  },
  fil: {
    haloFrom: '#c9f879ff', haloTo: '#FFFFFF',
    btnFrom: '#22D3EE', btnTo: '#3B82F6',
    btnText: 'white',
  },
  foot: {
    haloFrom: '#DFF6FF', haloTo: '#FFFFFF',
    btnFrom: '#22D3EE', btnTo: '#3B82F6',
    btnText: 'white',
  }, 
  businessAlt: {
    haloFrom: '#F0F0F0', haloTo: '#FFFFFF', // Тоже белые тона
    btnFrom: '#808080', btnTo: '#404040',
    btnText: 'white',
  }
};