import SmartView from './smart-view.js';
import {nanoid} from 'nanoid';
import he from 'he';

const renderGenres = (genres) => {
  let genresList = '';
  for (const genre of genres) {
    genresList += `<span class="film-details__genre">${genre}</span>`;
  }
  return genresList;
};

const renderComments = (comments) => {
  let commentsList = '';
  for (const comment of comments) {
    commentsList += `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="${comment.emotion}" width="55" height="55" alt="emoji-${comment.emotion.name}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.commentText}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.authorName ? comment.authorName : ''}</span>
                <span class="film-details__comment-day">${comment.commentDate ? comment.commentDate : ''}</span>
                <button id="${comment.id}" class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
  }
  return commentsList;
};

const popupTemplate = (popup) =>
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
            <div class="film-details__close">
                <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
                <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${popup.poster}" alt="">
                    <p class="film-details__age">${popup.censored}</p>
                </div>

                <div class="film-details__info">
                    <div class="film-details__info-head">
                        <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${popup.filmName}</h3>
                        <p class="film-details__title-original">${popup.originalFilmName}</p>
                    </div>

                    <div class="film-details__rating">
                    <p class="film-details__total-rating">${popup.rating}</p>
                    </div>
                </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${popup.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${popup.writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${popup.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${popup.realiseFullDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${popup.filmDuration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${popup.country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${popup.genres.length === 1 ? 'Genre' : 'Genres'}</td>
              <td class="film-details__cell">
                ${renderGenres(popup.genres)}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${popup.description}
          </p>
            </div>
        </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${popup.isAddedToWatchList ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${popup.isWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${popup.isAddedToFavorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments<span class="film-details__comments-count">${popup.comments.length}</span></h3>

        <ul class="film-details__comments-list"></ul>
            ${renderComments(popup.comments)}
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          <span class="film-details__comment-emoji"><img class="comment-emoji" src="${popup.commentEmoji}" width="55" height="55" alt=""></span>
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                        </label>
                    </div>
                </div>
            </section>
        </div>
    </form>
  </section>`;

export default class PopupView extends SmartView {

  constructor(film) {
    super();
    this._data = film;
    this.#setInnerHandlers();
  }

  get template() {
    return popupTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiHandler);
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchListClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watched = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favorite = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setWatchingListClickHandler = (callback) => {
    this._callback.watchingList = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchListClickHandler);
  };

  setDeleteCommentButtonClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    const buttons = this.element.querySelectorAll('.film-details__comment-delete');
    if(buttons){
      buttons.forEach((button) => {button.addEventListener('click', this.#deleteCommentClick);});
    }
  }

  setSubmitFormClickHandler = (callback) =>{
    this._callback.submitComment = callback;
    document.addEventListener('keydown', this.#submitFormKeyDown);
  }

  #submitFormKeyDown = (evt) => {
    if(evt.key === 'Enter' && evt.key === 'Control' && evt.which === 13 && evt.which === 17){//Условие не срабатывает
      const newComment = {
        id: nanoid(),
        commentText: he.encode(this.element.querySelector('.film-details__comment-input').value),
        emotion: this.element.querySelector('.comment-emoji').src,
      };
      this._callback.submitComment(newComment);
    }
  }

  #deleteCommentClick = (evt) => {
    if(evt.target.tagName !== 'BUTTON'){
      return;
    }
    evt.preventDefault();
    this._callback.deleteCommentClick(evt.target.id);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favorite();
  };

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchingList();
  };

  setCloseButtonHandler = (callback) => {
    this._callback.closeButton = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watched();
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButton();
  };

  #emojiHandler = (evt) => {
    this.element.querySelector('.comment-emoji').src = evt.target.src;
    this.updateData({commentEmoji: evt.target.src});
  };
}

