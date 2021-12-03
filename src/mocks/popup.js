import {getRandomInteger, getRandomArray} from './utils';

const WRITERS = ['Джадд Апатоу', 'Стивен Чбоски', 'Джеймс Айвори', 'София Коппола', 'Пол Шредер'];
const ACTORS = ['ЛИ ААКЕР','ФРЭНК ДЖ. ААРД', 'ААШ ААРОН', 'Австралийский актер', 'КУИНТОН ААРОН','НИКОЛАС ААРОН'];
const COUNTRIES = ['Russia', 'Belarus', 'USA', 'France'];
const DIRECTORS = ['ЛИ ААКЕР','ФРЭНК ДЖ. ААРД', 'ААШ ААРОН','Джадд Апатоу', 'Стивен Чбоски', 'Джеймс Айвори'];

export const getPopup = (filmCard) =>({
  poster: filmCard.poster,
  filmName: filmCard.filmName,
  originalFilmName: filmCard.filmName,
  rating: filmCard.rating,
  director: DIRECTORS[getRandomInteger(0, DIRECTORS.length)] ,
  writers: getRandomArray(WRITERS, 3),
  actors: ACTORS[getRandomInteger(0, ACTORS.length-1)],
  realiseDate:` ${filmCard.realise}`,
  duration: filmCard.duration,
  country: COUNTRIES[getRandomInteger(0, COUNTRIES.length-1)],
  genres: filmCard.genres,
  description: filmCard.fullDescription,
  censored: `${getRandomInteger(0,18 )}+`,
  comments: filmCard.comments,
  isAddedToWatchList: filmCard.isAddedToWatchList,
  isWatched: filmCard.isWatched,
  isAddedToFavorite: filmCard.isAddedToFavorite,
});

