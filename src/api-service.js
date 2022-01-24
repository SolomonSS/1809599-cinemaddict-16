const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
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
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(movie),
      headers: new Headers({'Content-Type': 'application/json'}),
    }).then((data)=>ApiService.parseResponse(data));
    return response;
  }

  getComments = async (movie) => {
    const response = await this.#load({
      url: `comments/${movie.id}`,
      method: Method.GET,
    }).then((data)=>ApiService.parseResponse(data));
    return response;
  }

  postComment = async (movie, localComment) => {
    const response = await this.#load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(localComment),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deleteComment = async (commentId) => {
    const response = await this.#load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    }).then((data)=>ApiService.parseResponse(data));
    return response;
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

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
