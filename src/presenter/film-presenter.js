import FilmCardView from '../view/film-card-view.js';
import {render, RenderPosition} from '../render.js';
import PopupView from '../view/popup.js';

const pageFooter = document.querySelector('.footer');

export default class FilmPresenter {
  #film;
  #filmCard;
  #popup;
  #filmsContainer;

  constructor(container) {
    this.#filmsContainer = container;
  }

  init = (film) => {
    this.#film = film;
    this.#filmCard = new FilmCardView(this.#film);
    this.#popup = new PopupView(this.#film);
    render(this.#filmsContainer, this.#filmCard.element, RenderPosition.BEFOREEND);
    this.#filmCard.setClickHandler(this.#addPopup);
    this.#popup.setEscHandler(this.#escKeyDownHandler);
  };

  #renderPopup = () => {
    render(pageFooter, this.#popup.element, RenderPosition.BEFOREEND);

  };

  removePopupElement = () => {
    this.#popup.element.remove();
    this.#popup.remove();
  };

  #addPopup = () => {
    this.#renderPopup();
    this.#popup.element.querySelector('.film-details__close-btn').addEventListener('click', this.#removePopup);
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
}
