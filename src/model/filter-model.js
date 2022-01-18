import AbstractObservable from '../utils/abstract-observable.js';
import {FilterTypes} from '../const.js';

export default class FilterModel extends AbstractObservable {
  #filter = FilterTypes.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
