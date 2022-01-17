import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="#all" id = '${type}' class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">${name}<span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');
  return`<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class FilterView extends AbstractView {
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
    if(evt.target.tagName !== 'A'){
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.id);
  };
}

