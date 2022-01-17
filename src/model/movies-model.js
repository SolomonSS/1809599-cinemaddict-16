import AbstractObservable from '../utils/abstract-observable.js';

export default class MoviesModel extends AbstractObservable{
  #movies = [];

  set movies(movies){
    this.#movies = [...movies];
  }

  get movies(){
    return this.#movies;
  }

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
  }

  addComment = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);
    this.#movies[index].updateMovie(updateType, update);

    this._notify(updateType, update);
  }

  deleteComment = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
