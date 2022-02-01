import SmartView from './smart-view.js';

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const createSortList = (activeSort) => (
  `<ul class="sort">
    <li><a href="#" class="sort__button ${activeSort === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${activeSort === SortType.DATE ? 'sort__button--active' : ''}"  data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${activeSort === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends SmartView {
  #activeSort;
  constructor(activeSort) {
    super();
    this.#activeSort = activeSort;
  }

  get template() {
    return createSortList(this.#activeSort);
  }

  setSortTypeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeHandler);
  };

  #sortTypeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };

  restoreHandlers = () => {
    this.setSortTypeHandler(this._callback.sortTypeChange);
  };
}

