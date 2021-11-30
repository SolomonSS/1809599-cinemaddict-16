import {createTopRatedTemplate} from './view/detailed-information-view.js';
import {createSiteMenuTemplate} from './view/menu-view.js';
import {createUserRankTemplate} from './view/user-rank-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import {createSortList} from './view/sort.js';
import {createMainSheme} from './view/main-sheme.js';
import {films} from './mocks/film.js';

const FILM_COUNT = 5;

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');

renderTemplate(pageHeader, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(pageMain, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(pageMain, createSortList(), RenderPosition.BEFOREEND);
renderTemplate(pageMain, createMainSheme(), RenderPosition.BEFOREEND);

const filmsList = document.querySelector('.films-list__container');
for(let i =0; i<FILM_COUNT; i++){
  renderTemplate(filmsList, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}
renderTemplate(pageMain, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);
renderTemplate(pageMain, createTopRatedTemplate(), RenderPosition.BEFOREEND);


