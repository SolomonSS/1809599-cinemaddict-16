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
    this.#filmCard.setClickHandler(this.#addPopup);
    render(this.#filmsContainer, this.#filmCard.element, RenderPosition.BEFOREEND);
  };

  #renderPopup = () => {
    render(pageFooter, this.#popup.element, RenderPosition.BEFOREEND);
    this.#popup.setCloseButtonHandler(this.#removePopup);
    document.addEventListener('keydown', (evt)=>{
      if(evt.key ==='Escape' || evt.key === 'Esc'){
        this.#removePopup();
      }
    });
  };

  #addPopup = () => {
    this.#renderPopup();
    this.#popup.restoreHandlers();
  };

  #removePopup = () => {
    this.#popup.element.remove();
    this.#popup.remove();
  };
}
