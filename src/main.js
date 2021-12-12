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
const filmsList = pageMain.querySelector('.films-list__container');

const onEscKeyDownHandler = (popup) => {
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      popup.element.remove();
      popup.remove();
      document.removeEventListener('keydown', onEscKeyDownHandler);
    }
  });
};

const addCardClicker = (cardData) => {
  const card = new FilmCardView(cardData);
  render(filmsList, card.element, RenderPosition.BEFOREEND);
  card.setClickHandler(() => {
    const popup = new PopupView(cardData);
    render(pageFooter, popup.element, RenderPosition.BEFOREEND);
    onEscKeyDownHandler(popup);
    const closePopupButton = popup.element.querySelector('.film-details__close-btn');
    closePopupButton.addEventListener('click', () => {
      popup.element.remove();
      popup.remove();
    });
  });
};

for (let i = 0; i < FILM_COUNT; i++) {
  addCardClicker(films[i]);
}
const showMoreButton = new ShowMoreButtonView();
render(pageMain, showMoreButton.element, RenderPosition.BEFOREEND);
render(pageMain, new TopRatedTemplateView().element, RenderPosition.BEFOREEND);

showMoreButton.setClickHandler(() => {
  const renderCards = films.slice(startIndex, startIndex + FILM_COUNT);
  startIndex += FILM_COUNT;
  renderCards.forEach((card) => {
    addCardClicker(card);
  });
  if (startIndex >= films.length) {
    showMoreButton.element.remove();
    showMoreButton.remove();
  }
});
