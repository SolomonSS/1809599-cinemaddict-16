import {createElement} from '../utils/render.js';

export default class AbstractView {
  _element = null;
  _callback = {};

  constructor() {
    if(new.target ===AbstractView){
      throw new Error('Can`t instantiate AbstractView');
    }
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }
    return this._element;
  }

  get template() {
    throw new Error('Abstract method not implement');
  }

  removeElement() {
    this._element = null;
  }
}
