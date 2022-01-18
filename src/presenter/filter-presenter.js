import FilterView from '../view/filters-view.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {filter, FilterTypes, UpdateType} from '../const.js';

export default class FilterPresenter{
  #filterComponent = null;
  #renderPlace = null;
  #movieModel = null;
  #filterModel = null;

  constructor(renderPlace, moviesModel, filterModel) {
    this.#renderPlace = renderPlace;
    this.#movieModel = moviesModel;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const movies = this.#movieModel.movies;

    return [
      {
        type: FilterTypes.ALL,
        name: 'All movies',
        count: filter[FilterTypes.ALL](movies).length,
      },
      {
        type: FilterTypes.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterTypes.WATCHLIST](movies).length,
      },
      {
        type: FilterTypes.HISTORY,
        name: 'History',
        count: filter[FilterTypes.HISTORY](movies).length,
      },
      {
        type: FilterTypes.FAVORITES,
        name: 'Favorites',
        count: filter[FilterTypes.FAVORITES](movies).length,
      },
    ];
  }

  init = () =>{
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    if(prevFilterComponent === null){
      render(this.#renderPlace, this.#filterComponent.element, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
