import SmartView from './smart-view.js';

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
                <span class="film-details__comment-author">${comment.authorName}</span>
                <span class="film-details__comment-day">${comment.commentDate}</span>
                <button class="film-details__comment-delete">Delete</button>
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
              <td class="film-details__cell">${popup.realise}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${popup.duration}</td>
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
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${popup.isAddedToWatchList && 'film-card__controls-item--active'}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched ${popup.isWatched && 'film-card__controls-item--active'}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${popup.isAddedToFavorite && 'film-card__controls-item--active'}" id="favorite" name="favorite">Add to favorites</button>
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
    this._data = PopupView.parseMovieToData(film);
    this.restoreHandlers();
  }

  get template() {
    return popupTemplate(this._data);
  }

  restoreHandlers = (cb) => {
    this.#setInnerHandlers(cb);
    this.setEmojiClickHandler();
  }

  #setInnerHandlers = (cb) => {
    this.setCloseButtonHandler(cb);
    this.setEscHandler(cb);
  }

  setEscHandler = (callback) => {
    this._callback.escKeyDown = callback;
    document.addEventListener('keydown', this.#escapeKeydownHandler);
  };

  setCloseButtonHandler = (callback) => {
    this._callback.closeButton = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButton();
  };

  #escapeKeydownHandler = (evt) => {
    evt.preventDefault();
    this._callback.escKeyDown();
  };

  setEmojiClickHandler = (callback) => {
    this._callback.emojiClick = callback;//Не могу понять, какой колбек сюда передать и где, т.к. после updateData необходимо ещё вызвать this.restoreHandlers,
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiHandler);//а в него при вызове тоже необходим коллбек, можно добавить второй коллбек на вход в restore,
  };//но мне кажется что я чего-то не догоняю, и что всё можно сделать намного проще.

  #emojiHandler = (evt) => {
    this.updateData({commentEmoji: evt.target.value});
    this._callback.emojiClick(PopupView.parseDataToMovie(this._data));
  }

  static parseMovieToData = (film) => ({
    ...film,
    isWatched: film.isWatched,
    isFavorite: film.isFavorite,
    isAddedToWatchList: film.isAddedToWatchList,
  });

  static parseDataToMovie = (data) => {
    const film = {...data};
    if (!film.isFavorite) {
      film.isFavorite = false;
    }
    if (!film.isWatched){
      film.isWatched = false;
    }
    if (!film.isAddedToWatchList){
      film.isAddedToWatchList = false;
    }
    return film;
  };
}

