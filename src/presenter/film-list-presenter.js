import TopRatedTemplateView from '../view/top-rated.js';
import SiteMenuView from '../view/menu-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortListView from '../view/sort.js';
import MainSheme from '../view/main-sheme.js';
import {render, RenderPosition} from '../utils/render.js';
import FilmPresenter from './film-presenter.js';

let startIndex = 0;
const FILM_COUNT_PER_CLICK = 5;

export default class FilmListPresenter {
  #topRated = new TopRatedTemplateView();
  #siteMenu = new SiteMenuView();
  #showMoreButton = new ShowMoreButtonView();
  #sortList = new SortListView();
  #mainSheme = new MainSheme();
  #mainContainer;
  #filmPresenter = new Map();
  _filmsListContainer;
  _filmsList;
  _sortedFilmList;

  constructor(main) {
    this.#mainContainer = main;
  }

  init = (films) => {
    this._filmsList = films;
    this._sortedFilmList = films;
    this.#renderPageElements();
    this._filmsListContainer = document.querySelector('.films-list__container');
    this.#renderFilmCards();
    this.#showMoreButton.setClickHandler(this.#renderFilmCards);
  };

  #renderPageElements = () => {
    render(this.#mainContainer, this.#siteMenu.element, RenderPosition.AFTERBEGIN);
    render(this.#mainContainer, this.#sortList.element, RenderPosition.BEFOREEND);
    render(this.#mainContainer, this.#mainSheme.element, RenderPosition.BEFOREEND);
    render(this.#mainContainer, this.#showMoreButton.element, RenderPosition.BEFOREEND);
    render(this.#mainContainer, this.#topRated.element, RenderPosition.BEFOREEND);
  };

  #renderFilmCards = (films = this._sortedFilmList) => {
    const nextCards = films.slice(startIndex, startIndex + FILM_COUNT_PER_CLICK);
    startIndex += FILM_COUNT_PER_CLICK;
    nextCards.forEach(this.#renderFilmCard);
    if (startIndex >= films.length) {
      this.#buttonRemove();
      this.#clearMoviesList();
    }
  };

  #renderFilmCard = (card) => {
    const film = new FilmPresenter(this._filmsListContainer);
    film.init(card);
    this.#filmPresenter.set(card.id, film);
  };

  #buttonRemove = () => {
    this.#showMoreButton.element.remove();
    this.#showMoreButton.remove();
  };

  #clearMoviesList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    startIndex = 0;
  };

  #sortByDate = (movieA, movieB) => movieA.realise - movieB.realise;
  #sortByRating = (movieA, movieB) => movieA.rating - movieB.rating;
}
