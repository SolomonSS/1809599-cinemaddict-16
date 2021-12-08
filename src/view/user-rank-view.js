import {createElement} from '../render.js';

const createUserRankTemplate = () => (`
  <section class="header__profile profile">
    <p class="profile__rating"></p>
    <img class="profile__avatar" src="images/emoji/puke.png" alt="Avatar" width="35" height="35">
  </section>
`);

export default class UserRankView{
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createUserRankTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

