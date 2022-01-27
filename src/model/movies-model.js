import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';
import {getShortDescription} from '../utils/render.js';


export default class MoviesModel extends AbstractObservable {
  #movies = [];
  #apiService = null;
  #comments;

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

  get comments() {
    return this.#comments;
  }

  getComments = (updateType, movie) => {
    this.#apiService.getComments(MoviesModel.adaptToServer(movie)).then((data) => {
      this.#comments = data;
      this._notify(updateType, movie);
    });
  };

  postComment = (updateType, update, localComment) => {
    this.#apiService.postComment(MoviesModel.adaptToServer(update), localComment).then((response)=>{
      const newMovie = this.#adaptToClient(response.movie);
      this.#comments = response.comments;
      this._notify(updateType, newMovie);
    });
  };

  removeComment =  (updateType, update, comment) => {
    const index = this.#comments.findIndex((item) => item.id === comment);
    if (index === -1) {
      throw new Error('Can\'t remove unexisting comment');
    }
    try{
      this.#apiService.deleteComment(comment).then(()=>{
        this.#comments = [...this.#comments.slice(0, index), ...this.#comments.slice(index+1)];
        this._notify(updateType, update);
      });
    }
    catch (err){
      throw new Error('Can\'t remove comment');
    }

  };

  #adaptToClient = (movie) => ({
    id: movie.id,
    filmName: movie.film_info.title,
    originalFilmName: movie.film_info.alternative_title,
    poster: `${movie.film_info.poster}`,
    fullDescription: movie.film_info.description,
    description: getShortDescription(movie.film_info.description),
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
  });

  static adaptToServer = (movie) => ({
    id: movie.id,
    comments: movie.comments,
    film_info: {
      alternative_title: movie.originalFilmName,
      poster: movie.poster,
      description: movie.fullDescription,
      director: movie.director,
      title: movie.filmName,
      writers: [...movie.writers],
      actors: [...movie.actors],
      total_rating: movie.rating,
      release: {
        date: movie.realise,
        release_country: movie.country,
      },
      runtime: movie.filmDuration,
      genre: [...movie.genres],
      age_rating: movie.censored,
    },
    user_details: {
      watchlist: movie.isAddedToWatchList,
      favorite: movie.isAddedToFavorite,
      already_watched: movie.isWatched,
      watching_date: movie.watchingTime,
    }
  });

  updateMovie = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }
    await this.#apiService.updateMovie(MoviesModel.adaptToServer(update)).then((movie) => {
      const updatedMovie = this.#adaptToClient(movie);
      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1),
      ];

      this._notify(updateType, updatedMovie);
    });
  };
}
