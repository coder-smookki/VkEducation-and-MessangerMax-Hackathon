import type { ImageKey } from './images';

export type CharacterId = 'programmer' | 'business' | 'filolog' | 'foot';

export type Character = {
  id: CharacterId;
  name: string;
  image: ImageKey; 
  story: string;   
};

export const characters: Character[] = [
  {
    id: 'programmer',
    name: 'Саня, 21 год',
    image: 'programmer',
    story:
      'Учится в университете, не может найти работу, нет денег оплатить общежитие. Помоги Сане справиться с выгоранием и найти работу!'
  },
  {
    id: 'business',
    name: 'Бизнес',
    image: 'business',
    story:
      'Начинал с продажи лимонада у школы, а затем запустил своё первое приложение. Ищет идеи, где технология встречается с пользой для людей.'
  },
  {
    id: 'filolog',
    name: 'Филолог',
    image: 'fil',
    story:
      'Любит редкие языки и рукописи. Верит, что правильно рассказанная история может менять судьбы — и хочет собрать библиотеки живых рассказов.'
  },
  {
    id: 'foot',
    name: 'Хуесос',
    image: 'foot',
    story:
      'Любит сосать пенисы'
  }

];