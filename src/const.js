export const FILM_COUNT_PER_CLICK = 5;

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'ALL',
  FAVORITES: 'FAVORITES',
  WATCHLIST: 'WATCHLIST',
  HISTORY: 'HISTORY',
};

export const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.isAddedToFavorite),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.isAddedToWatchList),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isWatched),
};

export const MenuItem = {
  MOVIES : 'MOVIES',
  STATISTIC: 'STATISTIC',
};

export const UserAction = {
  UPDATE: 'UPDATE',
  GET_COMMENTS:'GET_COMMENTS',
  ADD_COMMENT: 'ADD_COMMENT',
  REMOVE_COMMENT: 'REMOVE_COMMENT',
};

export const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';
export const AUTHORIZATION = 'Basic jasndfas98';
export const FILMS_COUNT_EXTRA_BLOCKS = 2;
