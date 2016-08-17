import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdButton } from '@angular2-material/button';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MaWPediaApiService } from '~/src/client/services/';
import { MaWPediaMarkdownPipe } from '~/src/client/pipes/';
import * as enums from '~/src/common/enums';
import template from './index.html';
import styles from './index.scss';

@Component({
  directives: [MD_CARD_DIRECTIVES, ROUTER_DIRECTIVES, MdButton],
  pipes: [MaWPediaMarkdownPipe],
  selector: 'card-details',
  styles: [styles],
  template
})
class CardDetailsHomeComponent {

  static parameters = [[ActivatedRoute], [Title], [MaWPediaApiService]];

  cardTypes = enums.cardTypes;
  textTypes = enums.textTypes;
  cardExpansions = enums.cardExpansions;
  cardFactions = enums.cardFactions;
  isLogged = () => this._apiService.isLogged();
  showIllustrations = false;

  constructor(route, titleService, apiService) {

    this._apiService = apiService;
    this._titleService = titleService;
    this.code = route.snapshot.params.code;
    this._titleService.setTitle(`MaWpedia - [${this.code}]`);

    this._apiService.getCardByCode(this.code).toPromise()
    .then(card => {

      this.card = card;
      this.defaultIllustration = this.card.illustrations[this.card.defaultIllustration || 0];
      this._titleService.setTitle(`MaWpedia - [${this.code}] ${this.card.name}`);

    });

  }

  toggleIllustrations() {

    this.showIllustrations = !this.showIllustrations;

  }

}

export default CardDetailsHomeComponent;
