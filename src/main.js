import FilmListPresenter from './presenter/film-list-presenter.js';
import {render, RenderPosition} from './utils/render.js';
import UserRankView from './view/user-rank-view';
import {films} from './mocks/film.js';
import MoviesModel from './model/movies-model.js';

const moviesModel = new MoviesModel();
moviesModel.movies = films;
const pageMain = document.querySelector('.main');
const filmListPresenter = new FilmListPresenter(pageMain, moviesModel);
filmListPresenter.init();
const pageHeader = document.querySelector('.header');
render(pageHeader, new UserRankView().element, RenderPosition.BEFOREEND);
