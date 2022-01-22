const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this.#load({
      url: `movies/:${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  #adaptToServer = (movie) => {
    const adaptedMovie = {
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
        runtime: movie.duration,
        genre: [...movie.genres],
        age_rating: movie.censored,
      },
      user_details: {
        watchlist: movie.isAddedToWatchList,
        favorite: movie.isAddedToFavorite,
        already_watched: movie.isWatched,
        watching_date: movie.watchingTime,
      }
    };
    return adaptedMovie;
  };

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
