import AbstractView from './abstract-view.js';
import {sortByRating} from '../utils/render.js';
import FilmPresenter from '../presenter/film-presenter.js';

const createTopRatedTemplate = () => (
  `<section class="films">
  <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container" id="top-rated-movies"></div>
  </section>
  <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most Commented</h2>
      <div class="films-list__container" id="most-commented-movies"></div>
  </section>
 </section>`);

export default class TopRatedTemplateView extends AbstractView {
  #topRated;
  #mostCommented;

  constructor(data) {
    super();
    this._data = data;
    this.getTopRated();
    this.getMostCommented();
  }

  get template() {
    return createTopRatedTemplate();
  }

  getTopRated = () => {
    this.#topRated = this.element.querySelector('#top-rated-movies');
    this._data.sort(sortByRating);
    for (let i = 0; i < 2; i++) {
      new FilmPresenter(this.#topRated).init(this._data[i]);
    }
  };

  getMostCommented = () =>{
    this.#mostCommented = this.element.querySelector('#most-commented-movies');
    this._data.sort((movieA, movieB) => movieB.comments.length - movieA.comments.length);
    for (let i = 0; i < 2; i++) {
      new FilmPresenter(this.#mostCommented).init(this._data[i]);
    }
  }
}
