import TopRatedTemplateView from '../view/top-rated.js';
import SiteMenuView from '../view/menu-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortListView, {SortTypes} from '../view/sort.js';
import MainSheme from '../view/main-sheme.js';
import {render, RenderPosition, sortByDate, sortByRating, updateItem} from '../utils/render.js';
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
  _currentSortType = SortTypes.DEFAULT;

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
    this.#renderSortView();
    render(this.#mainContainer, this.#mainSheme.element, RenderPosition.BEFOREEND);
    render(this.#mainContainer, this.#showMoreButton.element, RenderPosition.BEFOREEND);
    render(this.#mainContainer, this.#topRated.element, RenderPosition.BEFOREEND);
  };

  #renderFilmCards = () => {
    const nextCards = this._sortedFilmList.slice(startIndex, startIndex + FILM_COUNT_PER_CLICK);
    startIndex += FILM_COUNT_PER_CLICK;
    nextCards.forEach(this.#renderFilmCard);
    if (startIndex >= this._sortedFilmList.length) {
      this.#buttonRemove();
    }
  };

//Комментарий 2
  #renderSortView = () => {
    render(this.#mainContainer, this.#sortList.element, RenderPosition.BEFOREEND);
    this.#sortList.setSortTypeHandler(this.#handleSortTypeChange);
  }

  #handleSortTypeChange = (sortType) => {
    if(this._currentSortType === sortType){
      return;
    }
    this.#sortFilms(sortType);
    this.#clearMoviesList();
    this.#renderFilmCards();
  }

  #sortFilms = (sortType) => {
    switch(sortType){
      case(SortTypes.DATE):
        this._sortedFilmList.sort(sortByDate);
        break;
      case(SortTypes.RATING):
        this._sortedFilmList.sort(sortByRating);
        break;
      default:
        this._sortedFilmList = this._filmsList;
    }
    this._currentSortType = sortType;
  }

  #renderFilmCard = (card) => {
    const filmPresenter = new FilmPresenter(this._filmsListContainer, this.#handleFilmChange);
    filmPresenter.init(card);
    this.#filmPresenter.set(card.id, filmPresenter);
  };

  #buttonRemove = () => {
    this.#showMoreButton.removeElement();
  };

  #clearMoviesList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    startIndex = 0;
    this.#buttonRemove();
  };

  #handleFilmChange = (updatedFilm) => {
    this._filmsList = updateItem(this._filmsList, updatedFilm);
    this._sortedFilmList = updateItem(this._sortedFilmList, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }
}
