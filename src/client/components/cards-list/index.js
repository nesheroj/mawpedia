import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/scan';
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { MaWPediaApiService } from '../../services/';
import { MaWPediaCapitalisePipe } from '../../pipes/';
import * as enums from '../../../common/enums';
import template from './index.html';
import styles from './index.scss';

@Component({
  directives: [ROUTER_DIRECTIVES],
  pipes: [MaWPediaCapitalisePipe],
  selector: 'cards-list',
  styles: [styles],
  template
})
class CardsHomeComponent {

  static parameters = [[ActivatedRoute], [Title], [MaWPediaApiService]];

  realm = window.location.hostname.split('.')[0] === 'mawpedia' ? 'mawpedia' : 'mitopedia';
  nextOffset = 0;
  maxOffset = 0;
  searchTerm = '';
  sortBy = '';
  reverse = false;
  showFilters = false;
  searchTermStream = new Subject();
  sortFields = enums.sortFields;
  cardTypes = enums.cardTypes;
  cardFactions = enums.cardFactions.filter(faction => enums.hiddenFactions[this.realm] && !enums.hiddenFactions[this.realm].includes(faction));
  cardExpansions = enums.cardExpansions[this.realm].filter(expansion => enums.hiddenExpansions[this.realm] && !enums.hiddenExpansions[this.realm].includes(expansion));
  extendedSearch = false;
  typeFilter = -1;
  textTypeFilter = -1;
  factionFilter = -1;
  expansionFilter = -1;
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

  constructor(route, titleService, apiService) {

    this._apiService = apiService;
    this.artist = decodeURIComponent(route.snapshot.params.artist || '');
    // titleService.setTitle(`MaWpedia - Cards`);

  }

  onSearch(offset = 0) {

    this.nextOffset = offset;

    const params = { offset };
    const filters = {};

    if (this.searchTerm.length > 0) {

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

    if (~this.expansionFilter) {

      filters.expansion = this.expansionFilter;

    }

    if (this.sortBy.length > 0) {

      params.sortBy = this.sortBy.toLowerCase();

      if (this.reverse) {

        params.reverse = 'true';

      }

    }

    if (Object.keys(filters).length > 0) {

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
    this.expansionFilter = -1;
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
