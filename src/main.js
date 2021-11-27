import {
  createMostCommentedTemplate,
  createTopRatedTemplate
} from './view/detailed-information-view.js';
import {createSiteMenuTemplate, createSortList} from './view/menu-view.js';
import {createUserRankTemplate} from './view/user-rank-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';
import {renderTemplate, RenderPosition} from './render.js';

const FILM_COUNT = 5;
const FILM_COUNT_RECCOMENDED = 2;

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');

renderTemplate(pageHeader, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(pageMain, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(pageMain, createSortList(), RenderPosition.BEFOREEND);
for(let i =0; i<FILM_COUNT; i++){
  renderTemplate(pageMain, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}
renderTemplate(pageMain, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);
renderTemplate(pageMain, createTopRatedTemplate(), RenderPosition.BEFOREEND);
for(let i =0; i<FILM_COUNT_RECCOMENDED; i++){
  renderTemplate(pageMain, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}
renderTemplate(pageMain, createMostCommentedTemplate(), RenderPosition.BEFOREEND);
for(let i =0; i<FILM_COUNT_RECCOMENDED; i++){
  renderTemplate(pageMain, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}
