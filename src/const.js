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

export const MenuItem = {
  MOVIES : 'MOVIES',
  STATISTIC: 'STATISTIC',
};

/*#filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    if (evt.target.dataset.menuType === MenuItem.STATISTIC) {
      this.#isActiveStatistic = true;
      this._callback.menuClick(evt.target.dataset.menuType);
      return;
    }
    if ((this.#isActiveStatistic) && (evt.target.dataset.menuType !== MenuItem.STATISTIC)) {
      this.#currentFilter = FilterTypes.ALL;
      this._callback.menuClick(evt.target.dataset.menuType);
      this._callback.filterTypeChange(evt.target.id);
    }
    this._callback.filterTypeChange(evt.target.id);
  };*/
