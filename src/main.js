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
import {getPopup} from './mocks/popup';

const FILM_COUNT = 5;
const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');

render(pageHeader, new UserRankView().element, RenderPosition.BEFOREEND);
render(pageMain, new SiteMenuView().element, RenderPosition.AFTERBEGIN);
render(pageMain, new SortListView().element, RenderPosition.BEFOREEND);
render(pageMain, new MainSheme().element, RenderPosition.BEFOREEND);

const onOpenedPopup = (element) => {
  element.addEventListener('click', () => {
    element.remove();
  });
};

let startIndex = 5;

const onFilmCardClick = (card) => {
  card.addEventListener('click', (evt) => {
    if (!evt.target.closest('.film-card__controls')) {
      render(pageMain, new PopupView(getPopup(card)).element, RenderPosition.BEFOREEND);
      const closePopupButton = pageMain.querySelector('.film-details__close-btn');
      onOpenedPopup(closePopupButton);
    }
  });
};

const filmsList = document.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT; i++) {
  const card = new FilmCardView(films[i]);
  render(filmsList, card.element, RenderPosition.BEFOREEND);
  onFilmCardClick(card.template);
}
render(pageMain, new ShowMoreButtonView().element, RenderPosition.BEFOREEND);
render(pageMain, new TopRatedTemplateView().element, RenderPosition.BEFOREEND);
const showMoreButton = pageMain.querySelector('.films-list__show-more');

const renderMoreCards = (cardsList) => {
  cardsList.forEach((card) => {
    render(filmsList, new FilmCardView(card).element, RenderPosition.BEFOREEND);
    onFilmCardClick(card);
  });
};

const onButtonClick = () => {
  const renderCards = films.slice(startIndex, startIndex + FILM_COUNT);
  startIndex += FILM_COUNT;
  renderMoreCards(renderCards);
  if (startIndex >= films.length) {
    showMoreButton.remove();
  }
};

showMoreButton.addEventListener('click', onButtonClick);


