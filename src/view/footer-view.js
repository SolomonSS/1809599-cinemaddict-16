import AbstractView from './abstract-view.js';

const createFooterTemplate = (data) => (`<p>${data} movies inside</p>`);

export default class FooterView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createFooterTemplate(this._data);
  }
}
