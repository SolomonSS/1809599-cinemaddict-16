import AbstractView from './abstract-view.js';

const createTopRatedTemplate = () => (`
<section class="films">
  <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
  </section>
  <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most Commented</h2>
      <div class="films-list__container"></div>
  </section>
 </section>
`);

export default class TopRatedTemplateView extends AbstractView{
  get template() {
    return createTopRatedTemplate();
  }
}
