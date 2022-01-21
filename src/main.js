import FilmListPresenter from './presenter/film-list-presenter.js';
import {remove, render, RenderPosition} from './utils/render.js';
import UserRankView from './view/user-rank-view';
import {films} from './mocks/film.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter';
import {MenuItem} from './const.js';
import FooterView from './view/footer-view.js';
import StatisticView from './view/statistic-view.js';

const moviesModel = new MoviesModel();
moviesModel.movies = films;

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');
const pageFooter = document.querySelector('.footer__statistics');

render(pageHeader, new UserRankView().element, RenderPosition.BEFOREEND);
render(pageFooter, new FooterView(moviesModel.movies.length).element, RenderPosition.AFTERBEGIN);

const filtersModel = new FilterModel();
const filterPresenter = new FilterPresenter(pageMain, moviesModel, filtersModel);
const filmListPresenter = new FilmListPresenter(pageMain, moviesModel, filtersModel);

let statisticComponent = null;

const handleSiteMenuClick = (menuItem) =>{
  switch (menuItem){
    case MenuItem.MOVIES:
      remove(statisticComponent);
      filmListPresenter.destroy();
      filterPresenter.destroy();
      filterPresenter.init();
      filmListPresenter.init();
      break;
    case MenuItem.STATISTIC:
      filterPresenter.destroy();
      filmListPresenter.destroy();
      filterPresenter.init();
      statisticComponent = new StatisticView(moviesModel.movies);
      render(pageMain, statisticComponent.element, RenderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.setMenuStatisticClickHandler(handleSiteMenuClick);

filterPresenter.init();
filmListPresenter.init();
