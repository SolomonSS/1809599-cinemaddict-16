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
  #film;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    if (!(evt.target.closest('.film-card__controls'))) {
      this._callback.click();
    } else {
      evt.preventDefault();
      evt.target.classList.remove('film-card__controls-item--active');
      this.#controlButtonsClickHandler(evt.target);
    }
    this.updateData(this.#film);
  };

  restoreHandlers = () => {
    this.setClickHandler(this._callback.click);
  }

  #controlButtonsClickHandler = (evtClick) => {
    if(evtClick.classList.contains('film-card__controls-item--add-to-watchlist')){
      this.#film = ({...this.#film, isAddedToWatchList : !this.#film.isAddedToWatchList});
    }
    if(evtClick.classList.contains('film-card__controls-item--mark-as-watched')){
      this.#film = ({...this.#film, isWatched : !this.#film.isWatched});
    }
    if(evtClick.classList.contains('film-card__controls-item--favorite')){
      this.#film = ({...this.#film, isAddedToFavorite : !this.#film.isAddedToFavorite});
    }
  }
}
