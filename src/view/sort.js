import AbstractView from './abstract-view.js';

const SortTypes = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING:'rating',
};

const createSortList = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortTypes.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortTypes.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortTypes.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortListView extends AbstractView{
  get template() {
    return createSortList();
  }

  setSortTypeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeHandler);
  }

  #sortTypeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}

