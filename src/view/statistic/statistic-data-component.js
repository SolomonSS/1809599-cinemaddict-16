import SmartView from '../smart-view.js';
import {render, RenderPosition} from '../../utils/render';
import {countMoviesByGenre, makeItemsUniq} from './statistic-view';

const MINUTES_IN_HOUR = 60;

const totalDuration = (movies)=>{
  let total = 0;
  for(const movie of movies){
    total+= movie.filmDuration;
  }
  return total;
};

const getTopGenre = (data) =>{
  const genresCountList = data.map((movie) => movie.genres);
  const uniqGenres = Array.from(makeItemsUniq(genresCountList));
  const movieByGenreCounts = countMoviesByGenre(genresCountList, uniqGenres);
  const max = Math.max.apply(null, movieByGenreCounts);
  const indexOfMax = movieByGenreCounts.indexOf(max);
  return uniqGenres[indexOfMax];
};

const getTotalMinutes = (movies)=>totalDuration(movies) % MINUTES_IN_HOUR;

const getTotalHours = (movies)=>(totalDuration(movies)-getTotalMinutes(movies))/MINUTES_IN_HOUR;

export const getWatched = (data) =>data.filter((movie) => movie.isWatched);

const createStatDataTemplate = (data)=>
  (`<ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${getWatched(data).length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${getTotalHours(getWatched(data))}<span class="statistic__item-description">h</span>${getTotalMinutes(getWatched(data))}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${getTopGenre(data)}</p>
      </li>
    </ul>`);

export default class StatisticDataComponent extends SmartView{
  constructor(data) {
    super();
    this._data = data;
  }

  get template(){
    return createStatDataTemplate(this._data);
  }

  render = (place)=>{
    render(place, this.element, RenderPosition.BEFOREEND);
  }
}
