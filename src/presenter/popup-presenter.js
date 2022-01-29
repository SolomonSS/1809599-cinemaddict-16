import PopupView from '../view/popup.js';
import {remove, replace} from '../utils/render.js';
import {UpdateType, UserAction} from '../const.js';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  UPDATING: 'UPDATING',
  ABORTING: 'ABORTING'
};

export default class PopupPresenter {
  #film;
  #popup = null;
  #changeData = null;
  #changeMode = null;
  #comments;

  constructor(changeData, changeMode) {
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film, comments = []) => {
    this.#film = film;
    this.#comments = comments;
    const prevPopupComponent = this.#popup;
    this.#popup = new PopupView(this.#film, this.#comments);
    this.#popup.setCloseButtonHandler(this.#handleClosePopupClick);
    this.#popup.setFavoriteClickHandler(this.#handleIsAddedToFavorite);
    this.#popup.setWatchedClickHandler(this.#handleIsWatched);
    this.#popup.setWatchingListClickHandler(this.#handleIsAddedToWatchList);
    this.#popup.setDeleteCommentButtonClickHandler(this.#handleDeleteCommentClick);
    this.#popup.setSubmitFormClickHandler(this.#handleSubmitComment);
    document.addEventListener('keydown', this.#escKeyDownHandler);

    if (prevPopupComponent === null) {
      document.body.appendChild(this.#popup.element);
      return;
    }
    replace(this.#popup, prevPopupComponent);
    remove(prevPopupComponent);
  };

  resetView = () => {
    this.#removePopup();
  };

  #handleDeleteCommentClick = (commentId) => {
    this.#setStateCommentDelete(commentId);
    this.#changeData(
      UserAction.REMOVE_COMMENT,
      UpdateType.PATCH,
      this.#film,
      commentId);
  };

  #setStateCommentDelete = (commentId) => {
    this.#popup.updateData({
      idCommentDelete: commentId,
    });

  }

  #handleClosePopupClick = () => {
    this.#removePopup();
  };

  #removePopup = () => {
    if (document.body.contains(this.#popup.element)) {
      document.body.removeChild(this.#popup.element);
      this.#popup = null;
    }
    this.#changeMode();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleIsAddedToFavorite = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {...this.#film, isAddedToFavorite: !this.#film.isAddedToFavorite});
  };

  #handleIsWatched = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {...this.#film, isWatched: !this.#film.isWatched});
  };

  setViewState = (state) => {
    switch (state) {
      case State.DELETING:
        this.#popup.updateData({isDeleting: true});
        break;
      case State.SAVING:
        this.#popup.updateData({isSaving: true});
        break;
      case State.UPDATING:
        this.#popup.updateData({isDisabled: true});
        break;
      case State.ABORTING:
        this.#popup.shake(this.#resetStateView);
        break;
    }
  };

  #resetStateView = () =>{
    this.#popup.updateData({
      isDisabled: false,
      isDeleting: false,
      isSaving: false
    });
  }

  #handleIsAddedToWatchList = () => {
    this.#changeData(UserAction.UPDATE,
      UpdateType.PATCH,
      {...this.#film, isAddedToWatchList: !this.#film.isAddedToWatchList});
  };

  #handleSubmitComment = (newComment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      this.#film,
      newComment);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
    }
  };
}
