import SmartView from '../smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import {replace} from '../../utils/render.js';
import StatisticDataComponent, {getWatched} from './statistic-data-component.js';

const Ranks = {
  novice:{
    min: 1,
    max:10,
    name: 'novice'
  },
  fan:{
    min: 11,
    max:20,
    name: 'fan'
  },
  movieBuff:{
    min:21,
    name:'movie buff',
  }
};

const getUserRank = (data) => {
  const watched = getWatched(data);
  let rank;
  if(watched.length>=Ranks.novice.min && watched.length<=Ranks.novice.max){
    rank = Ranks.novice.name;
  }
  if(watched.length>=Ranks.fan.min && watched.length<=Ranks.fan.max){
    rank = Ranks.fan.name;
  }
  if(watched.length>= Ranks.movieBuff.min){
    rank = Ranks.movieBuff.name;
  }
  return rank;
};

const createStatisticsTemplate = (data) => (
  `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUserRank(data)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    <div class="stat-data"></div>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`);

export const makeItemsUniq = (genresEachMovie) => {
  const genresList = new Set();
  genresEachMovie.forEach((movie) =>
    movie.forEach((genre) => genresList.add(genre)));
  return genresList;
};

export const countMoviesByGenre = (movies, genres) => {
  const moviesPerGenre = [];
  genres.forEach(() => moviesPerGenre.push(0));
  for (let i = 0; i < genres.length; i++) {
    movies.forEach((movie) => {
      if (movie.includes(genres[i])) {
        moviesPerGenre[i] += 1;
      }
    });
  }
  return moviesPerGenre;
};
const renderChart = (statisticCtx, movies) => {
  const BAR_HEIGHT = 50;
  const genresCountList = movies.map((movie) => movie.genres);
  const uniqGenres = Array.from(makeItemsUniq(genresCountList));
  const movieByGenreCounts = countMoviesByGenre(genresCountList, uniqGenres);
  statisticCtx.height = BAR_HEIGHT * uniqGenres.length;
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqGenres,
      datasets: [{
        data: movieByGenreCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export default class StatisticView extends SmartView {
  _data;
  #movieChart = null;
  currentPeriod = 'all-time';
  #statDataComponent = null;

  constructor(movies) {
    super();

    this._data = [...movies];

    this.#setChart(this._data);
    this.restoreHandlers();
    this.#statDataComponent = new StatisticDataComponent(this._data);
    this.#statDataComponent.render(this.element.querySelector('.stat-data'));
  }

  get template() {
    return createStatisticsTemplate(this._data);
  }

  periodChangeHandler = () => {
    this.element.querySelector('.statistic__filters').addEventListener('change', (evt) => {
      if (evt.target.tagName !== 'INPUT'||evt.target.value === this.currentPeriod){
        return;
      }
      const prevStatDataComponent = this.#statDataComponent;
      this.currentPeriod = evt.target.value;
      const data = [...this.#periodTimeChange(this.currentPeriod)];
      this.#statDataComponent = new StatisticDataComponent(data);
      replace(this.#statDataComponent, prevStatDataComponent);
      this.#setChart();
    });
  }

  removeElement() {
    super.removeElement();
    if(this.#movieChart){
      this.#movieChart.destroy();
      this.#movieChart = null;
    }
  }

  restoreHandlers = () => {
    this.periodChangeHandler();
  };

  #setChart = () => {
    const statisticCtx = this.element.querySelector('.statistic__chart');
    this.#movieChart = renderChart(statisticCtx, this.#periodTimeChange(this.currentPeriod));
  };

  #periodTimeChange = (value) => {
    const now = dayjs(dayjs().format());
    let newData;
    let timeChange;
    let convertedTime;
    switch (value) {
      case 'all-time' :
        return this._data;
      case 'today' : {
        timeChange = 0;
        newData = this._data.slice().filter((movie) => {
          convertedTime = dayjs(movie.watchingTime).format();
          return now.diff(convertedTime, 'day') === timeChange;
        });
        return newData;
      }
      case 'week' : {
        timeChange = 7;
        newData = this._data.slice().filter((movie) => {
          convertedTime = dayjs(movie.watchingTime).format();
          return Number(now.diff(convertedTime, 'day')) <= timeChange;
        });
        return newData;
      }
      case 'month' : {
        timeChange = 30;
        newData = this._data.slice().filter((movie) => {
          convertedTime = dayjs(movie.watchingTime).format();
          return Number(now.diff(convertedTime, 'day')) <= timeChange;
        });
        return newData;
      }
      case 'year' : {
        timeChange = 365;
        newData = this._data.slice().filter((movie) => {
          convertedTime = dayjs(movie.watchingTime).format();
          return Number(now.diff(convertedTime, 'day')) <= timeChange;
        });
        return newData;
      }
    }
  };
}

export {getWatched, getUserRank};


