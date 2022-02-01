import TopRatedTemplateView from '../view/top-rated-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortView, {SortType} from '../view/sort-view.js';
import MainShemeView from '../view/main-sheme-view.js';
import {remove, render, RenderPosition, sortByDate, sortByRating} from '../utils/render.js';
import FilmPresenter from './film-presenter.js';
import {FILM_COUNT_PER_CLICK, FILMS_COUNT_EXTRA_BLOCKS, filter, FilterTypes, UpdateType, UserAction} from '../const.js';
import EmptyView from '../view/empty-view.js';
import LoadingView from '../view/loading-view.js';
import {State} from './popup-presenter.js';
import UserRankView from '../view/user-rank-view.js';
import MostCommentedView from '../view/most-commented-view.js';

const FilmListType = {
  ALL:'all',
  TOP:'toprated',
  MOST:'mostcommented'
};

export default class FilmListPresenter {
  #moviesModel = null;
  #topRated = null;
  #mostCommented;
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
  #topRatedPresenters = new Map();
  #mostCommentedPresenters = new Map();

  constructor(main, moviesModel, filtersModel) {
    this.#mainContainer = main;
    this.#moviesModel = moviesModel;
    this.#filterModel = filtersModel;
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
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
        if(this.#filmPresenter.has(update.id)){
          this.#filmPresenter.get(update.id).setViewState(State.UPDATING);
        }
        if(this.#topRatedPresenters.has(update.id)){
          this.#topRatedPresenters.get(update.id).setViewState(State.UPDATING);
        }
        if(this.#mostCommentedPresenters.has(update.id)){
          this.#mostCommentedPresenters.get(update.id).setViewState(State.UPDATING);
        }
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
          this.#filmPresenter.get(update.id).setViewState(State.ABORTING);
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
        if(this.#filmPresenter.has(data.id)){
          this.#filmPresenter.get(data.id).init(data, this.#moviesModel.comments);
        }
        if(this.#topRatedPresenters.has(data.id)){
          this.#topRatedPresenters.get(data.id).init(data, this.#moviesModel.comments);
        }
        if(this.#mostCommentedPresenters.has(data.id)){
          this.#mostCommentedPresenters.get(data.id).init(data, this.#moviesModel.comments);
        }
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
    if (moviesCount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
    this.#renderTopRated();
    this.#renderMostCommented();
  };

  #renderShowMoreButton = () => {
    this.#showMoreButton = new ShowMoreButtonView();
    this.#showMoreButton.setClickHandler(this.#handleLoadMoreButtonClick);
    render(this.#filmsListContainer, this.#showMoreButton.element, RenderPosition.AFTEREND);
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

  #renderFilmCard = (place, card, type) => {
    const filmPresenter = new FilmPresenter(place, this.#handleViewAction, this.#handleModeChange);
    filmPresenter.init(card);
    if(type === FilmListType.ALL){
      this.#filmPresenter.set(card.id, filmPresenter);
    }
    if(type === FilmListType.TOP){
      this.#topRatedPresenters.set(card.id, filmPresenter);
    }
    if(type === FilmListType.MOST){
      this.#mostCommentedPresenters.set(card.id, filmPresenter);
    }
  };

  #renderTopRated = () => {
    const movies = this.movies.sort(sortByRating).slice(0, FILMS_COUNT_EXTRA_BLOCKS);
    if (movies[0].rating > 0) {
      this.#topRated = new TopRatedTemplateView();
      render(this.#mainContainer.querySelector('section.films'), this.#topRated.element, RenderPosition.BEFOREEND);
      const container = this.#topRated.element.querySelector('#top-rated-movies');
      movies.forEach((movie) => {
        this.#renderFilmCard(container, movie, FilmListType.TOP);
      });
    }
  };

  #renderMostCommented = () => {
    const movies = this.movies.sort((movieA, movieB) => movieB.comments.length - movieA.comments.length).slice(0, FILMS_COUNT_EXTRA_BLOCKS);
    if (movies[0].comments.length > 0) {
      this.#mostCommented = new MostCommentedView();
      render(this.#mainContainer.querySelector('section.films'), this.#mostCommented.element, RenderPosition.BEFOREEND);
      const container = this.#mostCommented.element.querySelector('#most-commented-movies');
      movies.forEach((movie) => {
        this.#renderFilmCard(container, movie, FilmListType.MOST);
      });
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
    this.#clearMoviesList();
    this.#renderFilmCards();
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderFilmCard(this.#filmsListContainer, movie, FilmListType.ALL));
  };

  #buttonRemove = () => {
    remove(this.#showMoreButton);
  };

  #clearMoviesList = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#buttonRemove();
    remove(this.#topRated);
    remove(this.#mostCommented);
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
