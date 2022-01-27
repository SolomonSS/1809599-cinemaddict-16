import SmartView from './smart-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const createFilmCardTemplate = (film) => `<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${film.filmName}</h3>
            <p class="film-card__rating">${film.rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${dayjs(film.realise).format('YYYY')}</span>
              <span class="film-card__duration">${dayjs.duration(film.filmDuration, 'minutes').format('H[h] mm[m]')}</span>
              <span class="film-card__genre">${film.genres.length<3? film.genres : film.genres[0], film.genres[1]}</span>
            </p>
            <img src="${film.poster}" alt="Photo" class="film-card__poster">
            <p class="film-card__description">${film.description}</p>
            <span class="film-card__comments">${film.comments.length === 1 ? '1 comment' : ` ${film.comments.length} comments`}</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.isAddedToWatchList ? 'film-card__controls-item--active' : ''}" type="button" ${film.isDisabled ? 'disabled':''}>Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.isWatched ? 'film-card__controls-item--active' : ''}" type="button" ${film.isDisabled ? 'disabled':''}>Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${film.isAddedToFavorite ? 'film-card__controls-item--active' : ''}" type="button" ${film.isDisabled ? 'disabled':''}>Mark as favorite</button>
          </div>
   </article>`;

export default class FilmCardView extends SmartView {

  constructor(film) {
    super();
    this._data = FilmCardView.parseMovieToData(film);
  }

  get template() {
    return createFilmCardTemplate(this._data);
  }

  setFilmCardClickHandler = (callback) => {
    this._callback.filmCardClick = callback;
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

  restoreHandlers = () => {
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addedToWatchListClickHandler);
    this.element.addEventListener('click', this.#filmCardClickHandler);
  };

  #filmCardClickHandler = (evt) => {
    if (!(evt.target.closest('.film-card__controls'))) {
      this._callback.filmCardClick();
    }
  };

  #addedToWatchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.isAddedToWatchList();
  };

  static parseMovieToData = (movie) => ({
    ...movie,
    isDisabled: false,
  });

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.isWatched();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.isFavorite();
  };
}
