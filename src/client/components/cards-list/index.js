import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/scan';
import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';
import { Title } from 'angular2/platform/browser';
import { Subject } from 'rxjs/Subject';
import { MdButton } from '@angular2-material/button';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MdCheckbox } from '@angular2-material/checkbox';
import { MaWPediaApiService } from '~/src/client/services/';
import { MaWPediaCapitalisePipe } from '~/src/client/pipes/';
import * as enums from '~/src/common/enums';
import { RouterLinkle } from '~/src/client/directives/';
import template from './index.html';
import styles from './index.scss';

const PAGE_SIZE = 10;

@Component({
  directives: [MD_CARD_DIRECTIVES, ROUTER_DIRECTIVES, MD_INPUT_DIRECTIVES, MdButton, MdCheckbox, RouterLinkle],
  pipes: [MaWPediaCapitalisePipe],
  selector: 'cards-list',
  styles: [styles],
  template
})
class CardsHomeComponent {

  static parameters = [[RouteParams], [Title], [MaWPediaApiService]];

  nextOffset = 0;
  maxOffset = 0;
  searchTerm = '';
  sortBy = '';
  reverse = false;
  showFilters = false;
  searchTermStream = new Subject();
  sortFields = enums.sortFields;
  cardTypes = enums.cardTypes;
  cardFactions = enums.cardFactions;
  extendedSearch = false;
  typeFilter = -1;
  textTypeFilter = -1;
  factionFilter = -1;
  canLoadMore = false;

  cards = this.searchTermStream
  .debounceTime(300)
  .distinctUntilChanged()
  .switchMap(params => this.artist ? this._apiService.getCardsByArtist(this.artist, params) : this._apiService.getCards(params))
  .scan((acc, curr) => {

    const cards = this.nextOffset === 0 ? curr : [...acc, ...curr];
    this.nextOffset = cards.length;
    this.maxOffset = curr.total;
    return cards;

  }, []);

  constructor(routeParams, titleService, apiService) {

    this._apiService = apiService;
    this._routeParams = routeParams;
    this.artist = decodeURIComponent(this._routeParams.get('artist') || '');
    titleService.setTitle(`MaWPedia - Cards`);

  }

  onSearch(offset = 0) {

    this.nextOffset = offset;

    const params = { offset, limit: PAGE_SIZE };
    const filters = {};

    if (this.searchTerm.length) {

      filters.term = this.searchTerm.trim();

    }

    if (this.extendedSearch) {

      filters.extendedSearch = 'true';

    }

    if (~this.typeFilter) {

      filters.type = this.typeFilter;

    }

    if (~this.textTypeFilter) {

      filters.textType = this.textTypeFilter;

    }

    if (~this.factionFilter) {

      filters.faction = this.factionFilter;

    }

    if (this.sortBy.length) {

      params.sortBy = this.sortBy.toLowerCase();

      if (this.reverse) {

        params.reverse = 'true';

      }

    }

    if (Object.keys(filters).length) {

      params.filters = JSON.stringify(filters);

    }

    this.searchTermStream.next(params);

  }

  ngAfterViewInit() {

    this.onSearch();

  }

  resetFilters() {

    this.searchTerm = '';
    this.extendedSearch = false;
    this.typeFilter = -1;
    this.textTypeFilter = -1;
    this.factionFilter = -1;
    this.sortBy = '';
    this.reverse = false;

  }

  toggleFilters($event) {

    this.showFilters = !this.showFilters;
    $event.preventDefault();
    $event.stopPropagation();

  }

}

export default CardsHomeComponent;
