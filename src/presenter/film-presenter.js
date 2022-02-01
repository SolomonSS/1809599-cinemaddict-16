import FilmCardView from '../view/film-card-view.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {UpdateType, UserAction} from '../const.js';
import PopupPresenter, {State} from './popup-presenter';

export const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP'
};

export default class FilmPresenter {
  #film = null;
  #filmCard = null;
  #filmsContainer = null;
  #changeData = null;
  #changeMode = null;
  #comments;
  #popupPresenter;
  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode) {
    this.#filmsContainer = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#popupPresenter = new PopupPresenter(changeData, this.changeModeOnDefault);
  }

  init = (film, comments = []) => {
    this.#film = film;
    this.#comments = comments;
    const prevFilmComponent = this.#filmCard;
    this.#filmCard = new FilmCardView(this.#film);
    this.#filmCard.setFilmCardClickHandler(this.#handleOpenPopupClick);
    this.#filmCard.setIsFavoriteClickHandler(this.#handleIsAddedToFavorite);
    this.#filmCard.setIsWatchedClickHandler(this.#handleIsWatched);
    this.#filmCard.setIsAddedToWatchListClickHandler(this.#handleIsAddedToWatchList);

    if (prevFilmComponent === null) {
      render(this.#filmsContainer, this.#filmCard.element, RenderPosition.BEFOREEND);
      return;
    } else {
      replace(this.#filmCard, prevFilmComponent);
    }
    if (this.#mode === Mode.POPUP) {
      this.#popupPresenter.init(this.#film, this.#comments);
    }
    remove(prevFilmComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#popupPresenter.resetView();
    }
  };

  #addPopup = () => {
    this.#changeData(UserAction.GET_COMMENTS, UpdateType.PATCH, this.#film);
    this.#mode = Mode.POPUP;
  };

  changeModeOnDefault = () => {
    this.#mode = Mode.DEFAULT;
  };

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      if (state === State.UPDATING) {
        this.#filmCard.updateData({isDisabled: true});
        return;
      }
      if (state === State.ABORTING) {
        this.#filmCard.shake(this.resetViewState);
        return;
      }
    }
    this.#popupPresenter.setViewState(state);
  };

  resetViewState = () => {
    this.#filmCard.updateData({isDisabled: false});
  };

  #handleOpenPopupClick = () => {
    this.#changeMode();
    this.#addPopup();
  };

  #handleIsAddedToFavorite = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      {...this.#film, isAddedToFavorite: !this.#film.isAddedToFavorite});
  };

  #handleIsWatched = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      {...this.#film, isWatched: !this.#film.isWatched});
  };

  #handleIsAddedToWatchList = () => {
    this.#changeData(UserAction.UPDATE,
      UpdateType.MINOR,
      {...this.#film, isAddedToWatchList: !this.#film.isAddedToWatchList});
  };

  destroy = () => {
    this.#filmCard.element.remove();
    this.#filmCard.removeElement();
    this.#filmCard = null;
  };
}
