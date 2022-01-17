import TopRatedTemplateView from '../view/top-rated.js';
import SiteMenuView from '../view/menu-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortListView, {SortTypes} from '../view/sort.js';
import MainSheme from '../view/main-sheme.js';
import {remove, render, RenderPosition, sortByDate, sortByRating, updateItem} from '../utils/render.js';
import FilmPresenter from './film-presenter.js';
import {FILM_COUNT_PER_CLICK, UpdateType, UserAction} from '../const.js';

export default class FilmListPresenter {
  #moviesModel = null;
  #topRated = new TopRatedTemplateView();
  #siteMenu = new SiteMenuView();
  #showMoreButton = new ShowMoreButtonView();
  #sortList = new SortListView();
  #mainSheme = new MainSheme();
  #renderedFilmsCount = FILM_COUNT_PER_CLICK;
  #mainContainer;
  #filmPresenter = new Map();
  #filmsListContainer;
  _currentSortType = SortTypes.DEFAULT;

  constructor(main, moviesModel) {
    this.#mainContainer = main;
    this.#moviesModel = moviesModel;
  }

  get movies(){
    switch (this._currentSortType){
      case SortTypes.DATE:
        return [...this.#moviesModel.movies].sort(sortByDate);
      case SortTypes.RATING:
        return [...this.#moviesModel.movies].sort(sortByRating);
    }
    return this.#moviesModel.movies;
  }

  init = () => {
    this.#renderPageElements();
    this.#filmsListContainer = document.querySelector('.films-list__container');
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#renderFilmCards();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#moviesModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#moviesModel.deleteComment(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearMoviesList();
        this.#renderFilmCards();
        break;
      case UpdateType.MAJOR:
        this.#clearMoviesList({resetRenderedMoviesCount:true, resetSortType: true});
        this.#renderFilmCards();
        break;
    }
  }

  #renderPageElements = () => {
    render(this.#mainContainer, this.#siteMenu.element, RenderPosition.AFTERBEGIN);
    this.#renderSortView();
    render(this.#mainContainer, this.#mainSheme.element, RenderPosition.BEFOREEND);
    render(this.#mainContainer, this.#topRated.element, RenderPosition.BEFOREEND);
  };

  #renderFilmCards = () => {
    const moviesCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(moviesCount, FILM_COUNT_PER_CLICK));

    this.#renderMovies(movies);

    if (moviesCount > FILM_COUNT_PER_CLICK) {
      this.#renderShowMoreButton();
    }
  };

  #renderShowMoreButton = () => {
    this.#showMoreButton = new ShowMoreButtonView();
    this.#showMoreButton.setClickHandler(this.#handleLoadMoreButtonClick);
    render(this.#mainContainer, this.#showMoreButton.element, RenderPosition.BEFOREEND);
  };

  #handleLoadMoreButtonClick = () => {
    const moviesCount = this.movies.length;
    const newRenderedMoviesCount = Math.min(moviesCount, this.#renderedFilmsCount + FILM_COUNT_PER_CLICK);
    const movies = this.movies.slice(this.#renderedFilmsCount, newRenderedMoviesCount);

    this.#renderMovies(movies);
    this.#renderedFilmsCount = newRenderedMoviesCount;

    if (this.#renderedFilmsCount >= moviesCount) {
      remove(this.#showMoreButton);
    }
  }


  #renderSortView = () => {
    render(this.#mainContainer, this.#sortList.element, RenderPosition.BEFOREEND);
    this.#sortList.setSortTypeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this.#clearMoviesList({resetRenderedMoviesCount: false});
    this.#renderFilmCards();
  };

  #renderFilmCard = (card) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainer, this.#handleViewAction, this.#handleModeChange);
    filmPresenter.init(card);
    this.#filmPresenter.set(card.id, filmPresenter);
  };

  #renderMovies = (movies) =>{
    movies.forEach((movie) => this.#renderFilmCard(movie));
  }

  #buttonRemove = () => {
    remove(this.#showMoreButton);
  };

  #clearMoviesList = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#buttonRemove();
    if(resetRenderedMoviesCount){
      this.#renderedFilmsCount = FILM_COUNT_PER_CLICK;
    } else {
      this.#renderedFilmsCount = Math.min(moviesCount, this.#renderedFilmsCount);
    }
    if(resetSortType){
      this._currentSortType = SortTypes.DEFAULT;
    }
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }
}
