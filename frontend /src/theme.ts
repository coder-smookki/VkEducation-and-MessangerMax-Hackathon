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
    haloFrom: '#E3E0FF', haloTo: '#FFFFFF',
    btnFrom: '#6C63FF',  btnTo: '#7B61FF',
    btnText: 'white',
  },
  business: {
    haloFrom: 'rgba(236, 160, 98, 1)', haloTo: '#e24e09ff',
    btnFrom: 'rgba(145, 145, 145, 1)',  btnTo: '#5f5b5bff',
    btnText: 'white',
  },
  fil: {
    haloFrom: '#DFF6FF', haloTo: '#FFFFFF',
    btnFrom: '#22D3EE',  btnTo: '#3B82F6',
    btnText: 'white',
  },
  foot: {
     haloFrom: '#DFF6FF', haloTo: '#FFFFFF',
    btnFrom: '#22D3EE',  btnTo: '#3B82F6',
    btnText: 'white',
  },  businessAlt: {
     haloFrom: '#DFF6FF', haloTo: '#FFFFFF',
    btnFrom: '#22D3EE',  btnTo: '#3B82F6',
    btnText: 'white',
  }
};