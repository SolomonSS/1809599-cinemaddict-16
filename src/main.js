import FilmListPresenter from './presenter/film-list-presenter.js';
import {render, RenderPosition} from './utils/render.js';
import UserRankView from './view/user-rank-view';
import {films} from './mocks/film.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter';

const moviesModel = new MoviesModel();
moviesModel.movies = films;
const pageMain = document.querySelector('.main');
const filtersModel = new FilterModel();
const filterPresenter = new FilterPresenter(pageMain, moviesModel, filtersModel);
filterPresenter.init();
const filmListPresenter = new FilmListPresenter(pageMain, moviesModel, filtersModel);
filmListPresenter.init();
const pageHeader = document.querySelector('.header');
render(pageHeader, new UserRankView().element, RenderPosition.BEFOREEND);
