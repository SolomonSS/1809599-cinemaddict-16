import {createElement} from '../utils/render.js';

export default class AbstractView {
  #element = null;
  _callback = {};

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

  removeElement() {
    this.#element = null;
  }
}
