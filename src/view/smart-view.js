import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView{
  constructor() {
    super();
    /*this.element.querySelector('#watchlist').addEventListener('click', this.updateData);
    this.element.querySelector('#watched').addEventListener('click', this.updateData);
    this.element.querySelector('#favorite').addEventListener('click', this.updateData);*/
  }

  static restoreHandlers = () =>{}

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.remove();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);
  }

  updateData = (update) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    this.updateElement();
  }
}
