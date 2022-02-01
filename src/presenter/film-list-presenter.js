import TopRatedTemplateView from '../view/top-rated-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortView, {SortType} from '../view/sort-view.js';
import MainShemeView from '../view/main-sheme-view.js';
import {remove, render, RenderPosition, sortByDate, sortByRating} from '../utils/render.js';
import FilmPresenter from './film-presenter.js';
import {FILM_COUNT_PER_CLICK, filter, FilterTypes, UpdateType, UserAction} from '../const.js';
import EmptyView from '../view/empty-view.js';
import LoadingView from '../view/loading-view.js';
import {State} from './popup-presenter.js';
import UserRankView from '../view/user-rank-view.js';

export default class FilmListPresenter {
  #moviesModel = null;
  #topRated = null;
  #showMoreButton = new ShowMoreButtonView();
  #sortList;
  #userRank;
  #mainSheme = new MainShemeView();
  #loadingComponent = new LoadingView();
  #renderedFilmsCount = FILM_COUNT_PER_CLICK;
  #mainContainer;
  #filmPresenter = new Map();
  #filmsListContainer;
  _currentSortType = SortType.DEFAULT;
  #filterModel = null;
  #filterType = FilterTypes.ALL;
  #noMoviesComponent = null;
  #isLoading = true;

  constructor(main, moviesModel, filtersModel) {
    this.#mainContainer = main;
    this.#moviesModel = moviesModel;
    this.#filterModel = filtersModel;
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = [...this.#moviesModel.movies];
    const filteredMovies = filter[this.#filterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortByDate);
      case SortType.RATING:
        return filteredMovies.sort(sortByRating);
    }
    return filter[this.#filterType](this.#moviesModel.movies);
  }

  init = () => {
    this.#renderPageElements();
    this.#filmsListContainer = document.querySelector('.films-list__container');
    this.#renderFilmCards();
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  };

  #handleViewAction = async (userAction, updateType, update, localComment) => {
    switch (userAction) {
      case UserAction.UPDATE:
        this.#filmPresenter.get(update.id).setViewState(State.UPDATING);
        try {
          await this.#moviesModel.updateMovie(updateType, update);
        } catch (err) {
          this.#filmPresenter.get(update.id).setViewState(State.ABORTING);
        }
        break;
      case UserAction.GET_COMMENTS:
        try {
          await this.#moviesModel.getComments(updateType, update);
        } catch (err) {
          this.#filmPresenter.get(update.id).setViewState(State.ABORTING);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmPresenter.get(update.id).setViewState(State.SAVING);
        try {
          await this.#moviesModel.postComment(updateType, update, localComment);
        } catch (err) {
          this.#filmPresenter.get(update.id).setViewState(State.ABORTING);
        }
        break;
      case UserAction.REMOVE_COMMENT:
        this.#filmPresenter.get(update.id).setViewState(State.DELETING);
        try {
          await this.#moviesModel.removeComment(updateType, update, localComment);
        } catch (err) {
          this.#filmPresenter.get(update.id).setViewState(State.ABORTING ,UserAction.REMOVE_COMMENT);
        }
        break;
    }

  };

  destroy() {
    this.#clearMoviesList({resetRenderedMoviesCount: true, resetSortType: true});
    remove(this.#mainSheme);
    remove(this.#topRated);
    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #renderNoMovies = () => {
    this.#noMoviesComponent = new EmptyView(this.#filterType);
    render(this.#mainContainer, this.#noMoviesComponent.element, RenderPosition.BEFOREEND);
  };

  #renderLoading = () => {
    render(this.#mainContainer, this.#loadingComponent.element, RenderPosition.BEFOREEND);
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data, this.#moviesModel.comments);
        break;
      case UpdateType.MINOR:
        this.#clearMoviesList();
        this.#renderFilmCards();
        break;
      case UpdateType.MAJOR:
        this.#clearMoviesList({resetRenderedMoviesCount: true, resetSortType: true});
        this.#renderFilmCards();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilmCards();
        break;
    }
  };

  #renderUserRank = () => {
    const pageHeader = document.querySelector('.header');
    this.#userRank = new UserRankView(this.#moviesModel.movies);
    render(pageHeader, this.#userRank.element, RenderPosition.BEFOREEND);
  };

  #renderPageElements = () => {
    render(this.#mainContainer, this.#mainSheme.element, RenderPosition.BEFOREEND);
  };

  #renderFilmCards = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderUserRank();
    const moviesCount = this.movies.length;
    if (moviesCount === 0) {
      remove(this.#sortList);
    }
    if (moviesCount > 0 && this.#sortList !== null) {
      this.#renderSortView();
    }
    const movies = this.movies.slice(0, Math.min(moviesCount, this.#renderedFilmsCount));
    if (moviesCount === 0) {
      this.#renderNoMovies();
      return;
    }
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
  };


  #renderSortView = () => {
    this.#sortList = new SortView(this._currentSortType);
    render(this.#mainContainer, this.#sortList.element, RenderPosition.AFTERBEGIN);
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

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderFilmCard(movie));
  };

  #buttonRemove = () => {
    remove(this.#showMoreButton);
  };

  #clearMoviesList = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#buttonRemove();
    remove(this.#userRank);
    remove(this.#sortList);
    remove(this.#loadingComponent);
    if (resetRenderedMoviesCount) {
      this.#renderedFilmsCount = FILM_COUNT_PER_CLICK;
    } else {
      this.#renderedFilmsCount = Math.min(moviesCount, this.#renderedFilmsCount);
    }
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
    if (this.#noMoviesComponent) {
      remove(this.#noMoviesComponent);
    }
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };
}
