import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';
import { Title } from 'angular2/platform/browser';
import { MdButton } from '@angular2-material/button';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MaWPediaApiService } from '~/src/client/services/';
import { MaWPediaMarkdownPipe } from '~/src/client/pipes/';
import * as enums from '~/src/common/enums';
import { RouterLinkle } from '~/src/client/directives/';
import template from './index.html';
import styles from './index.scss';

@Component({
  directives: [MD_CARD_DIRECTIVES, ROUTER_DIRECTIVES, MdButton, RouterLinkle],
  pipes: [MaWPediaMarkdownPipe],
  selector: 'card-details',
  styles: [styles],
  template
})
class CardDetailsHomeComponent {

  static parameters = [[RouteParams], [Title], [MaWPediaApiService]];

  cardTypes = enums.cardTypes;
  textTypes = enums.textTypes;
  cardExpansions = enums.cardExpansions;
  cardFactions = enums.cardFactions;
  isLogged = () => this._apiService.isLogged();

  constructor(routeParams, titleService, apiService) {

    this._apiService = apiService;
    this._routeParams = routeParams;
    this._titleService = titleService;
    this.code = this._routeParams.get('code');
    this._titleService.setTitle(`MaWPedia - [${this.code}]`);

    this._apiService.getCardByCode(this.code).toPromise()
    .then(card => {

      this.card = card;
      this._titleService.setTitle(`MaWPedia - [${this.code}] ${this.card.name}`);

    });

  }

}

export default CardDetailsHomeComponent;
