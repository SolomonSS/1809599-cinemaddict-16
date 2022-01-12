import SmartView from './smart-view.js';

export const SortTypes = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const createSortList = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortTypes.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortTypes.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortTypes.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortListView extends SmartView {
  get template() {
    return createSortList();
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
    this.#renderActiveSortType(evt.target);
    this.updateData();
  };

  #renderActiveSortType = (sortButton) => {
    this.element.querySelectorAll('.sort__button').forEach((button) => {
      if (button.classList.contains('sort__button--active')) {
        button.classList.remove('sort__button--active');
      }
    });
    sortButton.classList.add('sort__button--active');
  };

  restoreHandlers = () => {
    this.setSortTypeHandler(this._callback.sortTypeChange);
  };
}

