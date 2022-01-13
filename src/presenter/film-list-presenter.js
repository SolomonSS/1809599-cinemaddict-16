import TopRatedTemplateView from '../view/top-rated.js';
import SiteMenuView from '../view/menu-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortListView, {SortTypes} from '../view/sort.js';
import MainSheme from '../view/main-sheme.js';
import {remove, render, RenderPosition, sortByDate, sortByRating, updateItem} from '../utils/render.js';
import FilmPresenter from './film-presenter.js';

export default class FilmListPresenter {
  #topRated = new TopRatedTemplateView();
  #siteMenu = new SiteMenuView();
  #showMoreButton = new ShowMoreButtonView();
  #sortList = new SortListView();
  #mainSheme = new MainSheme();
  #FILM_COUNT_PER_CLICK = 5;
  #startIndex = 0;
  #mainContainer;
  #filmPresenter = new Map();
  #filmsListContainer;
  #sourcedFilms;
  #sortedFilms;
  _currentSortType = SortTypes.DEFAULT;

  constructor(main) {
    this.#mainContainer = main;
  }

  init = (films) => {
    this.#sourcedFilms = [...films];
    this.#sortedFilms = [...films];
    this.#renderPageElements();
    this.#filmsListContainer = document.querySelector('.films-list__container');
    this.#renderFilmCards();
  };

  #renderPageElements = () => {
    render(this.#mainContainer, this.#siteMenu.element, RenderPosition.AFTERBEGIN);
    this.#renderSortView();
    render(this.#mainContainer, this.#mainSheme.element, RenderPosition.BEFOREEND);
    this.#renderShowMoreButton();
    render(this.#mainContainer, this.#topRated.element, RenderPosition.BEFOREEND);
  };

  #renderFilmCards = () => {
    this.#clearMoviesList();
    const nextCards = this.#sortedFilms.slice(0, this.#startIndex + this.#FILM_COUNT_PER_CLICK);
    this.#startIndex += this.#FILM_COUNT_PER_CLICK;
    nextCards.forEach(this.#renderFilmCard);
    if (this.#startIndex < this.#sortedFilms.length) {
      this.#renderShowMoreButton();
    }
  };

  #renderShowMoreButton = () => {
    this.#showMoreButton = new ShowMoreButtonView();
    this.#showMoreButton.setClickHandler(this.#renderFilmCards);
    render(this.#mainContainer, this.#showMoreButton.element, RenderPosition.BEFOREEND);
  };

  #renderSortView = () => {
    render(this.#mainContainer, this.#sortList.element, RenderPosition.BEFOREEND);
    this.#sortList.setSortTypeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this._currentSortType === sortType) {
      return;
    }
    this.#startIndex = 0;
    this.#sortFilms(sortType);
    this.#clearMoviesList();
    this.#renderFilmCards();
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case(SortTypes.DATE):
        this.#sortedFilms.sort(sortByDate);
        break;
      case(SortTypes.RATING):
        this.#sortedFilms.sort(sortByRating);
        break;
      case(SortTypes.DEFAULT):
        this.#sortedFilms = [...this.#sourcedFilms];
    }
    this._currentSortType = sortType;
  };

  #renderFilmCard = (card) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainer, this.#handleFilmChange);
    filmPresenter.init(card);
    this.#filmPresenter.set(card.id, filmPresenter);
  };

  #buttonRemove = () => {
    remove(this.#showMoreButton);
  };

  #clearMoviesList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#buttonRemove();
  };

  #handleFilmChange = (updatedFilm) => {
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#sortedFilms = updateItem(this.#sortedFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };
}
