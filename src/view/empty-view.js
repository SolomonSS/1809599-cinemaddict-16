import AbstractView from './abstract-view.js';
import {FilterTypes} from '../const';

const NoMoviesTextExamples = {
  [FilterTypes.ALL]: 'There are no movies in our database',
  [FilterTypes.FAVORITES]: 'There are no favorite movies now',
  [FilterTypes.WATCHLIST]: 'There are no movies to watch now',
  [FilterTypes.HISTORY]: 'There are no watched movies now',
};

const createEmptyTemplate = (filterType) => {
  const noMoviesText = NoMoviesTextExamples[filterType];
  return (`<h2 class="films-list__title">${noMoviesText}</h2>`);
};

export default class EmptyView extends AbstractView{
  constructor(data) {
    super();
    this._data = data;
  }

  get template(){
    return createEmptyTemplate(this._data);
  }
}

