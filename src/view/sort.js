import SmartView from './smart-view.js';

export const SortTypes = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const createSortList = (activeSort) => (
  `<ul class="sort">
    <li><a href="#" class="sort__button ${activeSort === SortTypes.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortTypes.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${activeSort === SortTypes.DATE ? 'sort__button--active' : ''}"  data-sort-type="${SortTypes.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${activeSort === SortTypes.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortTypes.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortListView extends SmartView {
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

