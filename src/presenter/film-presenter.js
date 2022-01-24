import FilmCardView from '../view/film-card-view.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import PopupView from '../view/popup.js';
import {UpdateType, UserAction} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class FilmPresenter {
  #film = null;
  #filmCard = null;
  #popup = null;
  #filmsContainer = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  #comments;

  constructor(container, changeData, changeMode,comments) {
    this.#filmsContainer = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#comments = comments;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmComponent = this.#filmCard;
    const prevPopupComponent = this.#popup;
    this.#filmCard = new FilmCardView(this.#film);
    this.#popup = new PopupView(this.#film);

    this.#filmCard.setFilmCardClickHandler(this.#handleOpenPopupClick);
    this.#filmCard.setIsFavoriteClickHandler(this.#handleIsAddedToFavorite);
    this.#filmCard.setIsWatchedClickHandler(this.#handleIsWatched);
    this.#filmCard.setIsAddedToWatchListClickHandler(this.#handleIsAddedToWatchList);
    this.#popup.setCloseButtonHandler(this.#handleClosePopupClick);
    this.#popup.setFavoriteClickHandler(this.#handleIsAddedToFavorite);
    this.#popup.setWatchedClickHandler(this.#handleIsWatched);
    this.#popup.setWatchingListClickHandler(this.#handleIsAddedToWatchList);
    this.#popup.setDeleteCommentButtonClickHandler(this.#handleDeleteCommentClick);
    this.#popup.setSubmitFormClickHandler(this.#handleSubmitComment);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this.#filmsContainer, this.#filmCard.element, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmCard, prevFilmComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#popup, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  };

  resetView = () => {
    if(this.#mode !== Mode.DEFAULT){
      this.#removePopup();
    }
  };

  #addPopup = () => {
    this.#changeData(UserAction.GET_COMMENTS, UpdateType.PATCH, this.#film);
    document.body.appendChild(this.#popup.element);
    this.#mode = Mode.EDITING;
  };

  #removePopup = () => {
    if(document.body.contains(this.#popup.element)){
      document.body.removeChild(this.#popup.element);
    }
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleClosePopupClick = () =>{
    this.#removePopup();
    this.#mode = Mode.DEFAULT;
  }

  #handleOpenPopupClick = () => {
    this.#addPopup();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
    }
  };

  #handleDeleteCommentClick = (commentId) => {
    this.#changeData(
      UserAction.REMOVE_COMMENT,
      UpdateType.PATCH,
      this.#film,
      commentId);
  };

  #handleIsAddedToFavorite = () => {
    this.#changeData(
      UserAction.UPDATE,
      this.#mode === Mode.EDITING ? UpdateType.PATCH : UpdateType.MINOR,
      {...this.#film, isAddedToFavorite: !this.#film.isAddedToFavorite});
  };

  #handleIsWatched = () => {
    this.#changeData(
      UserAction.UPDATE,
      this.#mode === Mode.EDITING ? UpdateType.PATCH : UpdateType.MINOR,
      {...this.#film, isWatched: !this.#film.isWatched});
  };

  #handleIsAddedToWatchList = () => {
    this.#changeData(UserAction.UPDATE,
      this.#mode === Mode.EDITING ? UpdateType.PATCH : UpdateType.MINOR,
      {...this.#film, isAddedToWatchList: !this.#film.isAddedToWatchList});
  };

  #handleSubmitComment = (newComment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      this.#film,
      newComment);
  };

  destroy = () => {
    this.#filmCard.element.remove();
    this.#filmCard.removeElement();
    this.#filmCard = null;
  };
}
