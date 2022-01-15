import FilmCardView from '../view/film-card-view.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import PopupView from '../view/popup.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class FilmPresenter {
  #film = null;
  #filmCard = null;
  #popup = null;
  #filmsContainer = null;
  #changeData = null;
  #changeMode = null;
  #pageFooter = document.querySelector('.footer');
  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode) {
    this.#filmsContainer = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmComponent = this.#filmCard;
    const prevPopupComponent = this.#popup;
    this.#filmCard = new FilmCardView(this.#film);
    this.#popup = new PopupView(this.#film);

    this.#filmCard.setFilmCardClickHandler(this.#addPopup);
    this.#filmCard.setIsFavoriteClickHandler(this.#handleIsAddedToFavorite);
    this.#filmCard.setIsWatchedClickHandler(this.#handleIsWatched);
    this.#filmCard.setIsAddedToWatchListClickHandler(this.#handleIsAddedToWatchList);
    this.#popup.setCloseButtonHandler(this.#removePopup);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this.#filmsContainer, this.#filmCard.element, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmCard, prevFilmComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#popup, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  };

  #renderPopup = () => {
    render(this.#pageFooter, this.#popup.element, RenderPosition.BEFOREEND);
  };

  resetView = () => {
    this.#filmCard.reset(this.#film);
  };

  #addPopup = () => {
    this.#renderPopup();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  };

  #removePopup = () => {
    this.#popup.element.remove();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
    }
  };

  #handleIsAddedToFavorite = () => {
    this.#changeData({...this.#film, isAddedToFavorite: !this.#film.isAddedToFavorite});
  };

  #handleIsWatched = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  };

  #handleIsAddedToWatchList = () => {
    this.#changeData({...this.#film, isAddedToWatchList: !this.#film.isAddedToWatchList});
  };

  destroy = () => {
    this.#filmCard.element.remove();
    this.#filmCard.removeElement();
    this.#filmCard = null;
  };
}
