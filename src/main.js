import TopRatedTemplateView from './view/top-rated.js';
import SiteMenuView from './view/menu-view.js';
import UserRankView from './view/user-rank-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import {render, RenderPosition} from './render.js';
import SortListView from './view/sort.js';
import MainSheme from './view/main-sheme.js';
import {films} from './mocks/film.js';
import FilmPresenter from './presenter/film-presenter';

let startIndex = 5;
const FILM_COUNT = 5;

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');
const pageFooter = document.querySelector('.footer');

render(pageHeader, new UserRankView().element, RenderPosition.BEFOREEND);
render(pageMain, new SiteMenuView().element, RenderPosition.AFTERBEGIN);
render(pageMain, new SortListView().element, RenderPosition.BEFOREEND);
render(pageMain, new MainSheme().element, RenderPosition.BEFOREEND);
const filmsList = pageMain.querySelector('.films-list__container');

/*const addCardClicker = (cardData) => {
  const card = new FilmCardView(cardData);
  const popup = new PopupView(cardData);
  render(filmsList, card.element, RenderPosition.BEFOREEND);
  card.setClickHandler(() => {
    render(pageFooter, popup.element, RenderPosition.BEFOREEND);
    onEscKeyDownHandler(popup);
    const closePopupButton = popup.element.querySelector('.film-details__close-btn');
    closePopupButton.addEventListener('click', () => {
      popup.element.remove();
      popup.remove();
    });
  });
};*/

for (let i = 0; i < FILM_COUNT; i++) {
  new FilmPresenter(films[i]).renderCard(filmsList);
  //addCardClicker(films[i]);
}
const showMoreButton = new ShowMoreButtonView();
render(pageMain, showMoreButton.element, RenderPosition.BEFOREEND);
render(pageMain, new TopRatedTemplateView().element, RenderPosition.BEFOREEND);

/*showMoreButton.setClickHandler(() => {
  const nextCards = films.slice(startIndex, startIndex + FILM_COUNT);
  startIndex += FILM_COUNT;
  nextCards.forEach(addCardClicker);
  if (startIndex >= films.length) {
    showMoreButton.element.remove();
    showMoreButton.remove();
  }
});*/
