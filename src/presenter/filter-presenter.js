import FiltersView from '../view/filters-view.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {filter, FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterComponent = null;
  #renderPlace = null;
  #movieModel = null;
  #filterModel = null;
  #menuClickCallback;

  constructor(renderPlace, moviesModel, filterModel) {
    this.#renderPlace = renderPlace;
    this.#movieModel = moviesModel;
    this.#filterModel = filterModel;
  }

  get filters() {
    const movies = this.#movieModel.movies;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](movies).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FiltersView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    this.#filterComponent.setStatisticsClickHandler(this.#menuClickCallback);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#movieModel.addObserver(this.#handleModelEvent);

    if (prevFilterComponent === null) {
      render(this.#renderPlace, this.#filterComponent.element, RenderPosition.BEFOREBEGIN);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;

    this.#movieModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
  };

  #handleModelEvent = () => {
    this.init();
  };

  setMenuStatisticClickHandler = (callback) => {
    this.#menuClickCallback = callback;
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
