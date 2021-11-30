import {getRandomArray, getRandomInteger} from './utils.js';

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

const getPoster = () => {
  const posters = ['made-for-each-other.png', 'popeye-meets-sinbad.png', 'sagebrush-trail.jpg', 'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg', 'the-great-flamarion.jpg', 'the-man-with-the-golden-arm.jpg'];
  return `/images/posters/${posters[getRandomInteger(0, posters.length - 1)]}`;
};

const NAMES = ['Film1', 'film2', 'film3', 'film4', 'Film15', 'Film16', 'Film7'];
const GENRES = ['genre1', 'genre2', 'genre3', 'genre4', 'genre5', 'genre6'];
const AUTHOR_NAMES = ['Name1', 'Name2', 'Name3', 'Name4', 'Name15', 'Name16', 'Name7'];

const getDescription = () => {
  const randomArrayDescription = getRandomArray(DESCRIPTIONS);
  let description = '';
  for (const text of randomArrayDescription) {
    description += text;
  }
  if (description.length > 140) {
    description = `${description.slice(0, 139)}…`;
  }
  return description;
};

const getComment = () => ({
  commentText: getDescription(),
  emotion: getRandomInteger(0,10),
  authorName: AUTHOR_NAMES[getRandomInteger(0, AUTHOR_NAMES.length-1)],
  commentDate:`${getRandomInteger(2010, 2021)}/${getRandomInteger(1, 12)}/${getRandomInteger(1, 30)} ${getRandomInteger(0, 23)}:${getRandomInteger(0, 59)}`,
});

const getComments = () => {
  const commentsQuantity = getRandomInteger(0, 5);
  return Array.from({length: commentsQuantity}, getComment);
};

const generateFilmCard = () => ({
  filmName: NAMES[getRandomInteger(0, NAMES.length - 1)],
  poster: getPoster(),
  description: getDescription(),
  rating: getRandomInteger(0, 10),
  realise: getRandomInteger(1995, 2021),
  duration: `${getRandomInteger(1, 3)}h ${getRandomInteger(0, 60)}m`,
  genres: getRandomArray(GENRES, 3),
  comments: getComments(),
  isAddedToWatchList: Boolean(getRandomInteger()),
  isWatched: Boolean(getRandomInteger()),
  isAddedToFavorite: Boolean(getRandomInteger()),
});


export const films = Array.from({length:FILM_CARDS_COUNT}, generateFilmCard);
export {getDescription, getComments, NAMES, AUTHOR_NAMES, GENRES, getPoster};
