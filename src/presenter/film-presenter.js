import FilmCardView from '../view/film-card-view.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import PopupView from '../view/popup.js';

const pageFooter = document.querySelector('.footer');

export default class FilmPresenter {
  #film = null;
  #filmCard = null;
  #popup = null;
  #filmsContainer = null;
  #changedData = null;

  constructor(container, changeData) {
    this.#filmsContainer = container;
    this.#changedData = changeData;
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

    if (this.#filmsContainer.contains(prevPopupComponent.element)) {
      replace(this.#filmCard, prevFilmComponent);
    }

    if (this.#filmsContainer.contains(prevPopupComponent.element)) {
      replace(this.#popup, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  };

  #renderPopup = () => {
    render(pageFooter, this.#popup.element, RenderPosition.BEFOREEND);
  };

  removePopupElement = () => {
    this.#popup.element.remove();
    this.#popup.removeElement();
  };

  #addPopup = () => {
    this.#removePopup();
    this.#renderPopup();
    this.#popup.restoreHandlers();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #removePopup = () => {
    this.removePopupElement();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
    }
  };

  #handleIsAddedToFavorite = () =>{
    this.#changedData = ({...this.#film, isAddedToFavorite : !this.#film.isAddedToFavorite});
  }

  #handleIsWatched = () => {
    this.#changedData = ({...this.#film, isWatched : !this.#film.isWatched});
  }

  #handleIsAddedToWatchList = () => {
    this.#changedData = ({...this.#film, isAddedToWatchList : !this.#film.isAddedToWatchList});
  }

  destroy = () => {
    this.#filmCard.element.remove();
    this.#filmCard.removeElement();
    this.#filmCard = null;
  };
}
