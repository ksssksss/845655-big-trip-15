import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import {calculateDurationFromMiliSeconds} from '../utils/date.js';
import {sortByMoneyDown, sortByTimeDown, sortByAmountDown} from '../utils/sort.js';

const BAR_HEIGHT = 55;

const renderTypeChart = (typeCtx, chartData) => {
  typeCtx.height = BAR_HEIGHT * chartData.length;
  chartData.sort(sortByAmountDown);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: chartData.map((item) => item.type.split('').map((chart) => chart.toUpperCase()).join('')),
      datasets: [{
        data: chartData.map((item) => item.amount),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        minBarLength: 50,
        barThickness: 44,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          // barThickness: 44,
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
          // minBarLength: 50,
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

const renderMoneyChart = (moneyCtx, chartData) => {
  moneyCtx.height = BAR_HEIGHT * chartData.length;
  chartData.sort(sortByMoneyDown);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: chartData.map((item) => item.type.split('').map((chart) => chart.toUpperCase()).join('')),
      datasets: [{
        data: chartData.map((item) => item.money),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        minBarLength: 50,
        barThickness: 44,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          // barThickness: 44,
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
          // minBarLength: 50,
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

const renderTimeSpendChart = (timeCtx, chartData) => {
  timeCtx.height = BAR_HEIGHT * chartData.length;
  chartData.sort(sortByTimeDown);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: chartData.map((item) => item.type.split('').map((chart) => chart.toUpperCase()).join('')),
      datasets: [{
        data: chartData.map((item) => item.timeSpend),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        minBarLength: 50,
        barThickness: 44,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => calculateDurationFromMiliSeconds(val),
        },
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          // barThickness: 44,
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
          // minBarLength: 50,
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

const createStatisticsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>
    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>
    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>
    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`
);

export default class Statistics extends SmartView {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
    this._events = this._pointsModel.getPoints();

    this._typeChart = null;
    this._moneyChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    if (this._typeChart !== null) {
      this._typeChart = null;
    }

    const typeCtx = this.getElement().querySelector('#type');
    const moneyCtx = this.getElement().querySelector('#money');
    const timeCtx = this.getElement().querySelector('#time-spend');

    this._uniqueEventsTypes = this._getUniqueEventsTypes();
    this._tripEventsChartData = this._getChartData();

    this._typeChart = renderTypeChart(typeCtx, this._tripEventsChartData);
    this._moneyChart = renderMoneyChart(moneyCtx, this._tripEventsChartData);
    this._timeSpendChart = renderTimeSpendChart(timeCtx, this._tripEventsChartData);
  }

  _getUniqueEventsTypes() {
    const uniqueTypes = [];

    this._events.forEach((event) => {
      if (uniqueTypes.indexOf(event.eventType) === -1) {
        uniqueTypes.push(event.eventType);
      }
    });

    return uniqueTypes;
  }

  _getFilteredEventsByType(event) {
    const filteredEventsByType = this._events.filter((filterEvent) => event === filterEvent.eventType);
    return filteredEventsByType;
  }

  _getChartData() {
    const tripEventsChartData = this._uniqueEventsTypes.map((event) => {
      const chartData = {
        type: event,
        money: this._getMoney(event),
        amount: this._getAmountEventsOfType(event),
        timeSpend: this._getSpendTime(event),
      };

      return chartData;
    });

    return tripEventsChartData;
  }

  _getMoney(event) {
    const filteredEventsByType = this._getFilteredEventsByType(event);
    const totalMoneyValue = filteredEventsByType.reduce((total, filteredEvent) => total + filteredEvent.price, 0);
    return totalMoneyValue;
  }

  _getAmountEventsOfType(currentEvent) {
    const allEventTypes = [];
    this._events.forEach((event) => {
      if (currentEvent === event.eventType) {
        allEventTypes.push(event.eventType);
      }
    });

    return allEventTypes.length;
  }

  _getSpendTime(event) {
    const filteredEventsByType = this._getFilteredEventsByType(event);
    const spendTime = filteredEventsByType.reduce((timeDifference, filteredEvent) => {
      const start = new Date(filteredEvent.dateTime.dateStart);
      const end = new Date(filteredEvent.dateTime.dateEnd);
      return timeDifference + (end - start);
    }, 0);

    return spendTime;
  }

}
