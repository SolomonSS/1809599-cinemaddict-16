import AbstractView from './abstract-view.js';
import {FilterType} from '../const';

const NoMoviesTextExample = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
};

const createEmptyTemplate = (filterType) => {
  const noMoviesText = NoMoviesTextExample[filterType];
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

