import {createTopRatedTemplate} from './view/detailed-information-view.js';
import {createSiteMenuTemplate} from './view/menu-view.js';
import {createUserRankTemplate} from './view/user-rank-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import {createSortList} from './view/sort.js';
import {createMainSheme} from './view/main-sheme.js';
import {films} from './mocks/film.js';
import {popupTemplate} from './view/popup';
import {getPopup} from './mocks/popup';

const FILM_COUNT = 5;

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');

renderTemplate(pageHeader, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(pageMain, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(pageMain, createSortList(), RenderPosition.BEFOREEND);
renderTemplate(pageMain, createMainSheme(), RenderPosition.BEFOREEND);

const filmsList = document.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT; i++) {
  renderTemplate(filmsList, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}
renderTemplate(pageMain, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);
renderTemplate(pageMain, createTopRatedTemplate(), RenderPosition.BEFOREEND);
renderTemplate(pageMain, popupTemplate(getPopup(films[0])), RenderPosition.BEFOREEND);
const showMoreButton = pageMain.querySelector('.films-list__show-more');
const popup = document.querySelector('.film-details');
const closePopupButton = popup.querySelector('.film-details__close-btn');

closePopupButton.addEventListener('click', () =>{
  popup.remove();
});

let startIndex = 5;

const renderMoreCards = (cardsList) => {
  cardsList.forEach((card) => {
    renderTemplate(filmsList, createFilmCardTemplate(card), RenderPosition.BEFOREEND);
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
