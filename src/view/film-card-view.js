export const createFilmCardTemplate = (film) => `<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${film.filmName}</h3>
            <p class="film-card__rating">${film.rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${film.realese}</span>
              <span class="film-card__duration">${film.duration}</span>
              <span class="film-card__genre">${film.genres}</span>
            </p>
            <img src="${film.poster}" alt="Photo" class="film-card__poster">
            <p class="film-card__description">${film.description}</p>
            <span class="film-card__comments">${film.comments.length === 1 ?'1 comment' : `${film.comments.length} comments`}</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.isAddedToWatchList && 'film-card__controls-item--active'}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.isWatched && 'film-card__controls-item--active'}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active ${film.isAddedToFavorite && 'film-card__controls-item--active'}" type="button">Mark as favorite</button>
          </div>
   </article>
`;


