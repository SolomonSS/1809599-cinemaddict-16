import FilmCardView from '../view/film-card-view.js';
import {render, RenderPosition} from '../render.js';
import {films} from '../mocks/film.js';
import PopupView from '../view/popup.js';
import {onEscKeyDownHandler} from '../mocks/utils.js';

const filmsCountForClick = 5;

export default class FilmPresenter{
#movieCard = null;

#filmCard = new FilmCardView(this.#movieCard);
#popup = new PopupView(this.#movieCard);

constructor(movieData) {
  this.#movieCard = movieData;
}

renderCard(container){
  render(container, this.#filmCard.element, RenderPosition.BEFOREEND);
  this.addListener(container);
}

addListener(container){
  this.#filmCard.setClickHandler(() =>{
    render(container, this.#popup.element, RenderPosition.BEFOREEND);
    onEscKeyDownHandler(this.#popup);
    this.closeButton().addEventListener(this.popupRemove);
  });
}

closeButton(){
  return this.#popup.element.querySelector('.film-details__close-btn');
}

popupRemove(){
  this.#popup.element.remove();
  this.#popup.remove();
}
}
