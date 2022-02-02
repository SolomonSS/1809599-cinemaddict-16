import AbstractView from './abstract-view.js';

const createMostCommentedTemplate = () =>(
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most Commented</h2>
      <div class="films-list__container" id="most-commented-movies"></div>
  </section>`);

export default class MostCommentedView extends AbstractView{
  get template() {
    return createMostCommentedTemplate();
  }
}
