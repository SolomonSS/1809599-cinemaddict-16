export const FILM_COUNT_PER_CLICK = 5;

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterTypes = {
  ALL: 'ALL',
  FAVORITES: 'FAVORITES',
  WATCHLIST: 'WATCHLIST',
  HISTORY: 'HISTORY',
};

export const filter = {
  [FilterTypes.ALL]: (movies) => movies,
  [FilterTypes.FAVORITES]: (movies) => movies.filter((movie) => movie.isAddedToFavorite),
  [FilterTypes.WATCHLIST]: (movies) => movies.filter((movie) => movie.isAddedToWatchList),
  [FilterTypes.HISTORY]: (movies) => movies.filter((movie) => movie.isWatched),
};
