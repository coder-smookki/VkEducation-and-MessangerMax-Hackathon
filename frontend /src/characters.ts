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
    name: 'Программист',
    image: 'programmer',
    story:
      'С детства собирал ломанные ПК и писал первые игры в блокноте. Сейчас мечтает выпустить инди-проект, который поможет людям учиться коду играя.'
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