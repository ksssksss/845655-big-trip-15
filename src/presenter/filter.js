import FiltersView from '../view/filters.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import {FilterType, UpdateType} from '../utils/const.js';

export default class Filter {
  constructor(filterContainer, filterModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;

    this._filterView = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterView = this._filterView;

    this._filterView = new FiltersView(filters, this._filterModel.getFilter());
    this._filterView.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterView=== null) {
      return render(this._filterContainer, this._filterView, RenderPosition.BEFOREEND);
    }

    replace(this._filterView, prevFilterView);
    remove(prevFilterView);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'EVERYTHING',
      },
      {
        type: FilterType.FUTURE,
        name: 'FUTURE',
      },
      {
        type: FilterType.PAST,
        name: 'PAST',
      },
    ];
  }
}
