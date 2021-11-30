import {getRandomInteger} from './utils';

const SCREEN_WRITERS = ['Джадд Апатоу', 'Стивен Чбоски', 'Джеймс Айвори', 'София Коппола', 'Пол Шредер'];
const ACTORS = ['ЛИ ААКЕР','ФРЭНК ДЖ. ААРД', 'ААШ ААРОН', 'Австралийский актер', 'КУИНТОН ААРОН','НИКОЛАС ААРОН'];
const COUNTRIES = ['Russia', 'Belarus', 'USA', 'France'];

const getPopup = (filmCard) =>({
  poster: filmCard.poster,
  filmName: filmCard.filmName,
  originalFilmName: filmCard.filmName.toUpperCase(),
  rating: filmCard.rating,
  director: filmCard.authorName.toUpperCase(),
  screenwriters: SCREEN_WRITERS[getRandomInteger(0, SCREEN_WRITERS.length-1)],
  actors: ACTORS[getRandomInteger(0, ACTORS.length-1)],
  realiseDate:` ${filmCard.realise}`,
  duration: filmCard.duration,
  country: COUNTRIES[getRandomInteger(0, COUNTRIES.length-1)],
  genres: filmCard.genres,
  description: filmCard.description,
  censored: `${getRandomInteger(0,18 )}+`,
  comments: filmCard.comments,
});
//На этом закончил, продолжение следует)
