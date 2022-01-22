import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';


export default class MoviesModel extends AbstractObservable {
  #movies = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const movies = await this.#apiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch (err) {
      this.#movies = [];
    }
    this._notify(UpdateType.INIT);
  };

  get movies() {
    return this.#movies;
  }

  #adaptToClient = (movie) => {
    const adaptedMovie = {
      ...movie,
      filmName: movie.film_info.title,
      originalFilmName: movie.film_info.alternative_title,
      poster: `${movie.film_info.poster}`,
      fullDescription: movie.film_info.description,
      description: movie.film_info.description,
      director: movie.film_info.director,
      writers: movie.film_info.writers,
      actors: movie.film_info.actors,
      rating: movie.film_info.total_rating,
      realise: movie.film_info.release.date,
      realiseFullDate: movie.film_info.release.date,
      filmDuration: movie.film_info.runtime,
      genres: movie.film_info.genre,
      country: movie.film_info.release.release_country,
      censored: movie.film_info.age_rating,
      comments: movie.comments,
      isAddedToWatchList: movie.user_details.watchlist,
      isWatched: movie.user_details.already_watched,
      isAddedToFavorite: movie.user_details.favorite,
      watchingTime: movie.user_details.watching_date ? movie.user_details.watching_date : '',
    };
    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;
    return adaptedMovie;
  };

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
