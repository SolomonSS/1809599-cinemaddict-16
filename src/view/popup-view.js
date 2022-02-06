import SmartView from './smart-view.js';
import he from 'he';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import {SHAKE_ANIMATION_TIMEOUT} from './abstract-view';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const renderGenres = (genres) => {
  let genresList = '';
  for (const genre of genres) {
    genresList += `<span class="film-details__genre">${genre}</span>`;
  }
  return genresList;
};

const renderEmoji = (emoji) => (`<img class="comment-emoji" src ='./images/emoji/${emoji}.png' width="55" height="55" alt="${emoji}">`);

const renderComments = (popup, comments) => {
  let commentsList = '';
  for (const comment of comments) {
    commentsList += `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author ? comment.author : ''}</span>
                <span class="film-details__comment-day">${comment.date ? dayjs(comment.date).fromNow() : ''}</span>
                <button id="${comment.id}" ${popup.idCommentDelete === comment.id ? 'disabled' : ''} class="film-details__comment-delete">${popup.idCommentDelete === comment.id ? 'Deleting...' : 'Delete'}</button>
              </p>
            </div>
          </li>`;
  }
  return commentsList;
};

const popupTemplate = (popup, comments) =>
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
              <td class="film-details__cell">${dayjs(popup.realiseFullDate).format('D MMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${dayjs.duration(popup.filmDuration, 'minutes').format('H[h] mm[m]')}</td>
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
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${popup.isAddedToWatchList ? 'film-details__control-button--active' : ''}" id="watchlist" ${popup.isDisabled ? 'disabled' : ''} name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${popup.isWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched" ${popup.isDisabled ? 'disabled' : ''}>Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${popup.isAddedToFavorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite" ${popup.isDisabled ? 'disabled' : ''}>Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">${popup.comments.length === 1 ? 'Comment' : 'Comments'}<span class="film-details__comments-count">${popup.comments.length}</span></h3>

        <ul class="film-details__comments-list"> ${comments.length === popup.comments.length ? renderComments(popup, comments) : 'Sorry, can\'t get comments from database'}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${popup.emoji ? renderEmoji(popup.emoji) : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${popup.isSaving ? 'disabled' : ''}></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="smile">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="sleeping">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="puke">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="angry">
                        </label>
                    </div>
                </div>
            </section>
        </div>
    </form>
  </section>`;

export default class PopupView extends SmartView {
  #comments;

  constructor(film, comments) {
    super();
    this._data = PopupView.parseMovieToData(film);
    this.#comments = comments;
    this.#setInnerHandlers();
  }

  get template() {
    return popupTemplate(this._data, this.#comments);
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
    this.setDeleteCommentButtonClickHandler(this._callback.deleteCommentClick);
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

  shakeComments = (callback) => {
    const comments = this.element.querySelector('.film-details__comments-wrap');
    comments.classList.add('shake');
    setTimeout(() => {
      comments.classList.remove('shake');
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  };

  setDeleteCommentButtonClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    const buttons = this.element.querySelectorAll('.film-details__comment-delete');
    if (buttons) {
      buttons.forEach((button) => {
        button.addEventListener('click', this.#deleteCommentClickHandler);
      });
    }
  };

  setSubmitFormClickHandler = (callback) => {
    this._callback.submitComment = callback;
    document.addEventListener('keydown', this.#submitFormKeyDownHandler);
  };

  #submitFormKeyDownHandler = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
      const commentInput = this.element.querySelector('.film-details__comment-input').value;
      if (commentInput.length === 0 || !this._data.emoji) {
        return;
      }
      const emoji = this.element.querySelector('.comment-emoji').alt;
      const newComment = {
        comment: he.encode(commentInput),
        emotion: emoji,
      };
      this._callback.submitComment(newComment);

    }
  };

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    this._callback.deleteCommentClick(evt.target.id);
  };

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
    evt.preventDefault();
    this.updateData({...this._data, emoji: evt.target.alt});
  };

  static parseMovieToData = (movie) => ({
    ...movie,
    isDisabled: false,
    isSaving: false,
  });
}


