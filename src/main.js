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

const filmsList = document.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT; i++) {
  render(filmsList, new FilmCardView(films[i]).element, RenderPosition.BEFOREEND);
}
render(pageMain, new ShowMoreButtonView().element, RenderPosition.BEFOREEND);
render(pageMain, new TopRatedTemplateView().element, RenderPosition.BEFOREEND);
render(pageMain, new PopupView(getPopup(films[0])).element, RenderPosition.BEFOREEND);
const showMoreButton = pageMain.querySelector('.films-list__show-more');
const popup = document.querySelector('.film-details');
const closePopupButton = popup.querySelector('.film-details__close-btn');

closePopupButton.addEventListener('click', () =>{
  popup.remove();
});

let startIndex = 5;

const renderMoreCards = (cardsList) => {
  cardsList.forEach((card) => {
    render(filmsList, new FilmCardView(card).element, RenderPosition.BEFOREEND);
  });
};

const onButtonClick = () => {
  const renderCards = films.slice(startIndex, startIndex + FILM_COUNT);
  startIndex += FILM_COUNT;
  renderMoreCards(renderCards);
  if(startIndex>=films.length) {
    showMoreButton.remove();
  }
};

showMoreButton.addEventListener('click', onButtonClick);

