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
let startIndex = 5;
render(pageHeader, new UserRankView().element, RenderPosition.BEFOREEND);
render(pageMain, new SiteMenuView().element, RenderPosition.AFTERBEGIN);
render(pageMain, new SortListView().element, RenderPosition.BEFOREEND);
render(pageMain, new MainSheme().element, RenderPosition.BEFOREEND);

const renderPopup = (data)=>{
  const card = getPopup(data);
  const popup = new PopupView(card);
  render(pageMain, popup.element, RenderPosition.BEFOREEND);
  const closePopupButton = popup.element.querySelector('.film-details__close-btn');
  closePopupButton.addEventListener('click', ()=>{
    closePopupButton.removeEventListener('click', renderPopup);
    popup.remove();
    popup.element.remove();
  });
};

const onFilmCardClick = (data) =>{
  const element = data.element;
  element.addEventListener('click', ()=> {
    renderPopup(data);
  });
};

const filmsList = document.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT; i++) {
  const card = new FilmCardView(films[i]);
  render(filmsList, card.element, RenderPosition.BEFOREEND);
  onFilmCardClick(card);
}
render(pageMain, new ShowMoreButtonView().element, RenderPosition.BEFOREEND);
render(pageMain, new TopRatedTemplateView().element, RenderPosition.BEFOREEND);
const showMoreButton = pageMain.querySelector('.films-list__show-more');

const renderMoreCards = (cardsList) => {
  cardsList.forEach((card) => {
    const filmCard = new FilmCardView(card).element;
    render(filmsList, filmCard, RenderPosition.BEFOREEND);
    onFilmCardClick(filmCard);
  });
};

const onButtonClick = () => {
  const renderCards = films.slice(startIndex, startIndex + FILM_COUNT);
  startIndex += FILM_COUNT;
  renderMoreCards(renderCards);
  if (startIndex >= films.length) {
    showMoreButton.remove();
  }
};

showMoreButton.addEventListener('click', onButtonClick);


