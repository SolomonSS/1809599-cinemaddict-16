import {createElement} from '../render.js';

export default class AbstractView {
  #element = null;
  _collback = {};

  constructor() {
    if(new.target ===AbstractView){
      throw new Error('Can`t instantiate AbstractView');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implement');
  }

  remove() {
    this.#element = null;
  }
}
