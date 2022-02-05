import AbstractView from './abstract-view.js';
import {getUserRank, getWatched} from './statistic/statistic-view';

const createUserRankTemplate = (data) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${data.length!== 0 ? getUserRank(getWatched(data)) : ''}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserRankView extends AbstractView{
  #data;
  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createUserRankTemplate(this.#data);
  }
}

