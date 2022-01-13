import SmartView from './smart-view.js';

const createFilmCardTemplate = (film) => `<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${film.filmName}</h3>
            <p class="film-card__rating">${film.rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${film.realise}</span>
              <span class="film-card__duration">${film.filmDuration}</span>
              <span class="film-card__genre">${film.genres}</span>
            </p>
            <img src="${film.poster}" alt="Photo" class="film-card__poster">
            <p class="film-card__description">${film.description}</p>
            <span class="film-card__comments">${film.comments.length === 1 ? '1 comment' : ` ${film.comments.length} comments`}</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.isAddedToWatchList ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.isWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${film.isAddedToFavorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
          </div>
   </article>
`;

export default class FilmCardView extends SmartView {

  constructor(film) {
    super();
    this._data = {...film};
  }

  get template() {
    return createFilmCardTemplate(this._data);
  }

  setFilmCardClickHandler = (callback) => {
    this._callback.filmCardClick = callback;
    this.element.addEventListener('click', this.#filmCardClickHandler);
  };

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.element.addEventListener('click', this.#filmCardClickHandler);
  };

  setIsFavoriteClickHandler = (callback) => {
    this._callback.isFavorite = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setIsWatchedClickHandler = (callback) => {
    this._callback.isWatched = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setIsAddedToWatchListClickHandler = (callback) => {
    this._callback.isAddedToWatchList = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addedToWatchListClickHandler);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addedToWatchListClickHandler);
  }

  #filmCardClickHandler = (evt) => {
    if (!(evt.target.closest('.film-card__controls'))) {
      this._callback.filmCardClick();
    }
  };

  #addedToWatchListClickHandler = () => {
    this._callback.isAddedToWatchList();
    this.updateData({
      isAddedToWatchList: !this._data.isAddedToWatchList
    });
  };

  #watchedClickHandler = () => {
    this._callback.isWatched();
    this.updateData({
      isWatched: !this._data.isWatched
    });
  };

  #favoriteClickHandler = () => {
    this._callback.isFavorite();
    this.updateData({
      isAddedToFavorite: !this._data.isAddedToFavorite
    });
  };
}
