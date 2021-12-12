import TopRatedTemplateView from './view/top-rated.js';
import SiteMenuView from './view/menu-view.js';
import UserRankView from './view/user-rank-view.js';
import FilmCardView from './view/film-card-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import {render, RenderPosition} from './render.js';
import SortListView from './view/sort.js';
import MainSheme from './view/main-sheme.js';
import {films} from './mocks/film.js';
import PopupView from './view/popup';

const FILM_COUNT = 5;
const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');
const pageFooter = document.querySelector('.footer');

let startIndex = 5;

render(pageHeader, new UserRankView().element, RenderPosition.BEFOREEND);
render(pageMain, new SiteMenuView().element, RenderPosition.AFTERBEGIN);
render(pageMain, new SortListView().element, RenderPosition.BEFOREEND);
render(pageMain, new MainSheme().element, RenderPosition.BEFOREEND);

const renderPopup = (element, data) => {
  element.addEventListener('click', () => {
    const popup = new PopupView(data);
    render(pageFooter, popup.element, RenderPosition.BEFOREEND);
    const closePopupButton = pageFooter.querySelector('.film-details__close-btn');
    closePopupButton.addEventListener('click', () => {
      popup.element.remove();
      popup.remove();
    });
  });
};

const filmsList = document.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT; i++) {
  const card = new FilmCardView(films[i]);
  render(filmsList, card.element, RenderPosition.BEFOREEND);
  renderPopup(card.element, films[i]);
}
const showMoreButton = new ShowMoreButtonView();
render(pageMain, showMoreButton.element, RenderPosition.BEFOREEND);
render(pageMain, new TopRatedTemplateView().element, RenderPosition.BEFOREEND);

showMoreButton.setClickHandler(() => {
  const renderCards = films.slice(startIndex, startIndex + FILM_COUNT);
  startIndex += FILM_COUNT;
  renderCards.forEach((card) => {
    const filmCard = new FilmCardView(card);
    render(filmsList, filmCard.element, RenderPosition.BEFOREEND);
    renderPopup(filmCard.element, card);
  });
  if (startIndex >= films.length) {
    showMoreButton.element.remove();
    showMoreButton.remove();
  }
});
