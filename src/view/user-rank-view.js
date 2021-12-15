import AbstractView from './abstract-view.js';

const createUserRankTemplate = () => (`
  <section class="header__profile profile">
    <p class="profile__rating"></p>
    <img class="profile__avatar" src="images/emoji/puke.png" alt="Avatar" width="35" height="35">
  </section>
`);

export default class UserRankView extends AbstractView{
  get template() {
    return createUserRankTemplate();
  }
}

