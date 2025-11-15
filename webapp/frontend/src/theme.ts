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
    btnFrom: '#808080', btnTo: '#404040', // Серые кнопки вместо оранжевых
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
  f1: {
   haloFrom: '#75d1f6ff', haloTo: '#FFFFFF',
    btnFrom: '#72e8faff', btnTo: '#3B82F6',
    btnText: 'white',
  },
  f2: {
    haloFrom: '#75d1f6ff', haloTo: '#FFFFFF',
    btnFrom: '#72e8faff', btnTo: '#3B82F6',
    btnText: 'white',
  },
  f3: {
   haloFrom: '#75d1f6ff', haloTo: '#FFFFFF',
    btnFrom: '#72e8faff', btnTo: '#3B82F6',
    btnText: 'white',
  },
  f4: {
   haloFrom: '#75d1f6ff', haloTo: '#FFFFFF',
    btnFrom: '#72e8faff', btnTo: '#3B82F6',
    btnText: 'white',
  },
  f5: {
   haloFrom: '#75d1f6ff', haloTo: '#FFFFFF',
    btnFrom: '#72e8faff', btnTo: '#3B82F6',
    btnText: 'white',
  },
  d1: {
    haloFrom: '#f499e8ff', haloTo: '#FFFFFF',
    btnFrom: '#f499e8ff', btnTo: '#f63ba2ff',
    btnText: 'white',
  },
  d2: {
     haloFrom: '#f499e8ff', haloTo: '#FFFFFF',
    btnFrom: '#f499e8ff', btnTo: '#f63ba2ff',
    btnText: 'white',
  },
  d3: {
     haloFrom: '#f499e8ff', haloTo: '#FFFFFF',
    btnFrom: '#f499e8ff', btnTo: '#f63ba2ff',
    btnText: 'white',
  },
  d4: {
    haloFrom: '#f499e8ff', haloTo: '#FFFFFF',
    btnFrom: '#f499e8ff', btnTo: '#f63ba2ff',
    btnText: 'white',
  },
  d5: {
   haloFrom: '#f499e8ff', haloTo: '#FFFFFF',
    btnFrom: '#f499e8ff', btnTo: '#f63ba2ff',
    btnText: 'white',
  },
  p1: {
  haloFrom: '#8478f6ff', haloTo: '#FFFFFF',
    btnFrom: '#6C63FF', btnTo: '#7B61FF',
    btnText: 'white',
  },
  p2: {
     haloFrom: '#8478f6ff', haloTo: '#FFFFFF',
    btnFrom: '#6C63FF', btnTo: '#7B61FF',
    btnText: 'white',
  },
  p3: {
   haloFrom: '#8478f6ff', haloTo: '#FFFFFF',
    btnFrom: '#6C63FF', btnTo: '#7B61FF',
    btnText: 'white',
  },
  p4: {
    haloFrom: '#8478f6ff', haloTo: '#FFFFFF',
    btnFrom: '#6C63FF', btnTo: '#7B61FF',
    btnText: 'white',
  },
  p5: {
  haloFrom: '#8478f6ff', haloTo: '#FFFFFF',
    btnFrom: '#6C63FF', btnTo: '#7B61FF',
    btnText: 'white',
  },
  b1: {
     haloFrom: '#d0bdbdff', haloTo: '#FFFFFF', // ИЗМЕНИЛ на белые тона
    btnFrom: '#808080', btnTo: '#404040', // Серые кнопки вместо оранжевых
    btnText: 'white',
  },
  b2: {
    haloFrom: '#d0bdbdff', haloTo: '#FFFFFF', // ИЗМЕНИЛ на белые тона
    btnFrom: '#808080', btnTo: '#404040', // Серые кнопки вместо оранжевых
    btnText: 'white',
  },
  b3: {
     haloFrom: '#d0bdbdff', haloTo: '#FFFFFF', // ИЗМЕНИЛ на белые тона
    btnFrom: '#808080', btnTo: '#404040', // Серые кнопки вместо оранжевых
    btnText: 'white',
  },
  b4: {
     haloFrom: '#d0bdbdff', haloTo: '#FFFFFF', // ИЗМЕНИЛ на белые тона
    btnFrom: '#808080', btnTo: '#404040', // Серые кнопки вместо оранжевых
    btnText: 'white',
  },
  b5: {
    haloFrom: '#d0bdbdff', haloTo: '#FFFFFF', // ИЗМЕНИЛ на белые тона
    btnFrom: '#808080', btnTo: '#404040', // Серые кнопки вместо оранжевых
    btnText: 'white',
  }
};