import {getRandomArray, getRandomInteger} from './utils.js';
import {nanoid} from 'nanoid';

const FILM_CARDS_COUNT = 20;
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];
const EMOJIS = ['angry.png','puke.png','sleeping.png','smile.png'];
const NAMES = ['Film1', 'film2', 'film3', 'film4', 'Film15', 'Film16', 'Film7'];
const GENRES = ['genre1', 'genre2', 'genre3', 'genre4', 'genre5', 'genre6'];
const AUTHOR_NAMES = ['Name1', 'Name2', 'Name3', 'Name4', 'Name15', 'Name16', 'Name7'];
const POSTERS = ['made-for-each-other.png', 'popeye-meets-sinbad.png', 'sagebrush-trail.jpg', 'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg', 'the-great-flamarion.jpg', 'the-man-with-the-golden-arm.jpg'];
const WRITERS = ['Джадд Апатоу', 'Стивен Чбоски', 'Джеймс Айвори', 'София Коппола', 'Пол Шредер'];
const ACTORS = ['ЛИ ААКЕР','ФРЭНК ДЖ. ААРД', 'ААШ ААРОН', 'Австралийский актер', 'КУИНТОН ААРОН','НИКОЛАС ААРОН'];
const COUNTRIES = ['Russia', 'Belarus', 'USA', 'France'];
const DIRECTORS = ['ЛИ ААКЕР','ФРЭНК ДЖ. ААРД', 'ААШ ААРОН','Джадд Апатоу', 'Стивен Чбоски', 'Джеймс Айвори'];

const getImgAddress = (type, list) => `images/${type}/${list[getRandomInteger(0, list.length - 1)]}`;

const getFullDescription = () => {
  const randomArrayDescription = getRandomArray(DESCRIPTIONS,5);
  let description = '';
  for (const text of randomArrayDescription) {
    description += text;
  }
  return description;
};

const getShortDescription = (description) =>{
  if (description.length > 140) {
    description = `${description.slice(0, 139)}…`;
  }
  return description;
};

const getComment = () => ({
  commentText: getShortDescription(getFullDescription()),
  emotion: getImgAddress('emoji', EMOJIS),
  authorName: AUTHOR_NAMES[getRandomInteger(0, AUTHOR_NAMES.length-1)],
  commentDate:`${getRandomInteger(2010, 2021)}/${getRandomInteger(1, 12)}/${getRandomInteger(1, 30)} ${getRandomInteger(0, 23)}:${getRandomInteger(0, 59)}`,
});

const getComments = () => {
  const commentsQuantity = getRandomInteger(0, 5);
  return Array.from({length: commentsQuantity}, getComment);
};

const generateFilmCard = () => {
  const descriptionValue = getFullDescription();
  const name = NAMES[getRandomInteger(0, NAMES.length - 1)];
  return {
    id: nanoid(),
    filmName: name,
    originalFilmName: name.toUpperCase(),
    poster: getImgAddress('posters', POSTERS),
    fullDescription: descriptionValue,
    description: getShortDescription(descriptionValue),
    director: DIRECTORS[getRandomInteger(0, DIRECTORS.length-1)] ,
    writers: getRandomArray(WRITERS, 3),
    actors: ACTORS[getRandomInteger(0, ACTORS.length-1)],
    rating: getRandomInteger(0, 10),
    realise: getRandomInteger(1995, 2021),
    duration: `${getRandomInteger(1, 3)}h ${getRandomInteger(0, 60)}m`,
    genres: getRandomArray(GENRES, 3),
    country: COUNTRIES[getRandomInteger(0, COUNTRIES.length-1)],
    censored: `${getRandomInteger(0,18 )}+`,
    comments: getComments(),
    isAddedToWatchList: Boolean(getRandomInteger()),
    isWatched: Boolean(getRandomInteger()),
    isAddedToFavorite: Boolean(getRandomInteger()),
  };
};


const films = Array.from({length:FILM_CARDS_COUNT}, generateFilmCard);
export {getFullDescription, getComments, NAMES, AUTHOR_NAMES, GENRES, films};
