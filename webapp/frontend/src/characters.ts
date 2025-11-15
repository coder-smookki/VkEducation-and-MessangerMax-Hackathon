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
    name: 'Олег Владимирович, 57 лет',
    image: 'business',
    story:
      'Прогорел бизнес, помогите Олегу вновь встать на ноги и разбогатеть'
  },
  {
    id: 'filolog',
    name: 'Аня, 20 лет',
    image: 'fil',
    story:
      'Перед сессией надо прочитать огромное количество произведений, помогите Ане не вылететь на доп.сессию по литературе и сдать экзамен на отлично'
  },
  {
    id: 'foot',
    name: 'Арсений, 19 лет',
    image: 'foot',
    story:
      'Во время матча получил серьезную травму, помоги ему восстановиться и вновь стать лучшим на поле'
  }

];