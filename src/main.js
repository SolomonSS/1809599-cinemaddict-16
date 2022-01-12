import FilmListPresenter from './presenter/film-list-presenter.js';
import {render, RenderPosition} from './utils/render.js';
import UserRankView from './view/user-rank-view';
import {films} from './mocks/film.js';

const pageMain = document.querySelector('.main');
const filmListPresenter = new FilmListPresenter(pageMain);
filmListPresenter.init(films);
const pageHeader = document.querySelector('.header');
render(pageHeader, new UserRankView().element, RenderPosition.BEFOREEND);
