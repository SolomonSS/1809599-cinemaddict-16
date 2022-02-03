import AbstractView from './abstract-view.js';
import {MenuItem} from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="#all" id = '${type}' data-menu-type = '${MenuItem.MOVIES}' class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">${name}<span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" data-menu-type ='${MenuItem.STATISTIC}' class="main-navigation__additional ${currentFilterType === MenuItem.STATISTIC ? 'main-navigation__additional-active' : ''}">Stats</a>
  </nav>`;
};

export default class FiltersView extends AbstractView {
  #currentFilter = null;
  #filters = null;

  constructor(filters, currentFilter) {
    super();
    this.#currentFilter = currentFilter;
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    if (evt.target.dataset.menuType === MenuItem.STATISTIC) {
      this._callback.menuClick(evt.target.dataset.menuType);
    } else {
      this._callback.menuClick(evt.target.dataset.menuType);
      this._callback.filterTypeChange(evt.target.id);
    }
  };

  setStatisticsClickHandler = (callback) => {
    this._callback.menuClick = callback;

  };
}

