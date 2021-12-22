import FilmListPresenter from './presenter/film-list-presenter.js';

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');
const filmsList = pageMain.querySelector('.films-list__container');
const filmListPresenter = new FilmListPresenter(pageHeader, pageMain, filmsList);
filmListPresenter.init();

