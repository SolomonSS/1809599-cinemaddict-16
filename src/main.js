import FilmListPresenter from './presenter/film-list-presenter.js';
import {render, RenderPosition} from './render.js';
import UserRankView from './view/user-rank-view';
const pageMain = document.querySelector('.main');
const filmListPresenter = new FilmListPresenter(pageMain);
filmListPresenter.init();
const pageHeader = document.querySelector('.header');
render(pageHeader, new UserRankView().element, RenderPosition.BEFOREEND);
