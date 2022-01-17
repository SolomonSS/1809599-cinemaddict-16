import AbstractView from './abstract-view.js';
import {FilterTypes} from '../const';

const NoMoviesTextExamples = {
  [FilterTypes.ALL]: 'ALL',
  [FilterTypes.FAVORITES]: 'Sorry, you have not added any movies to your favorites.',
  [FilterTypes.WATCHLIST]: 'Sorry, you have not added any movies to your watchlist.',
  [FilterTypes.HISTORY]: 'Unfortunately, you have not watched any of the films.',
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

