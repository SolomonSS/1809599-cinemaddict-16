import TopRatedTemplateView from '../view/top-rated.js';
import SiteMenuView from '../view/menu-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortListView from '../view/sort.js';
import MainSheme from '../view/main-sheme.js';
import {render, RenderPosition} from '../render.js';
import FilmPresenter from './film-presenter.js';
import {films} from '../mocks/film.js';

let startIndex = 0;
const FILM_COUNT_PER_CLICK = 5;

export default class FilmListPresenter {
  #topRated = new TopRatedTemplateView();
  #siteMenu = new SiteMenuView();
  #showMoreButton = new ShowMoreButtonView();
  #sortList = new SortListView();
  #mainSheme = new MainSheme();
  #mainContainer;
  _filmsList;

  constructor(main) {
    this.#mainContainer = main;
  }

  init = () =>{
    this.#renderPageElements();
    this._filmsList = document.querySelector('.films-list__container');
    this.#renderFilmCards();
    this.#showMoreButton.setClickHandler(this.#renderFilmCards);
  }

  #renderPageElements = () =>{
    render(this.#mainContainer, this.#siteMenu.element, RenderPosition.AFTERBEGIN);
    render(this.#mainContainer, this.#sortList.element, RenderPosition.BEFOREEND);
    render(this.#mainContainer, this.#mainSheme.element, RenderPosition.BEFOREEND);
    render(this.#mainContainer, this.#showMoreButton.element, RenderPosition.BEFOREEND);
    render(this.#mainContainer, this.#topRated.element, RenderPosition.BEFOREEND);
  }

  #renderFilmCards = () => {
    const nextCards = films.slice(startIndex, startIndex + FILM_COUNT_PER_CLICK);
    startIndex += FILM_COUNT_PER_CLICK;
    nextCards.forEach(this.#renderFilmCard);
    if (startIndex >= films.length) {
      this.#buttonRemove();
    }
  }

  #renderFilmCard = (card) =>{
    const film = new FilmPresenter(this._filmsList);
    film.init(card);
  }

  #buttonRemove = () =>{
    this.#showMoreButton.element.remove();
    this.#showMoreButton.remove();
  }
}
