import { Component } from 'angular2/core';
import { Title } from 'angular2/platform/browser';
import { Router, RouteParams } from 'angular2/router';
import { MdButton } from '@angular2-material/button';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdRadioButton, MdRadioGroup, MdRadioDispatcher } from '@angular2-material/radio';
import { MaWPediaApiService } from '~/src/client/services/';
import { MaWPediaJSONPipe } from '~/src/client/pipes/';
import { objSome } from '~/src/common/object-utils';
import * as enums from '~/src/common/enums';
import template from './index.html';
import styles from './index.scss';

@Component({
  directives: [MD_CARD_DIRECTIVES, MD_INPUT_DIRECTIVES, MD_LIST_DIRECTIVES, MdRadioButton, MdRadioGroup, MdButton],
  pipes: [MaWPediaJSONPipe],
  providers: [MdRadioDispatcher],
  selector: 'admin-card',
  styles: [styles],
  template
})
class AdminCardHomeComponent {

  static parameters = [[Router], [RouteParams], [Title], [MaWPediaApiService]];

  cardTypes = enums.cardTypes;
  textTypes = enums.textTypes;
  cardExpansions = enums.cardExpansions;
  cardFactions = enums.cardFactions;
  isLoading = true;

  constructor(router, routeParams, titleService, apiService) {

    this._router = router;
    this._routeParams = routeParams;
    this._apiService = apiService;
    this.initialiseCard();
    this.initialiseIllustration();
    this.initialiseText();
    this.code = this._routeParams.get('code');
    titleService.setTitle(this.code ? `MaWpedia - Edit Card` : `MaWpedia - Create Card`);

  }

  ngAfterViewInit() {

    if (!this._apiService.isLogged()) {

      this._router.navigate(['/Cards']);

    } else if (this.code) {

      this._apiService.getCardByCode(this.code).toPromise()
      .then(card => {

        this.isLoading = false;
        this.card = card;

      });

    } else {

      this.isLoading = false;

    }

  }

  canSubmit(formElement) {

    return !this.isLoading && formElement.form.valid && this.card.illustrations.length && objSome(textType => textType.length, this.card.texts);

  }

  onSubmit() {

    this.isLoading = true;
    this._apiService.postCard(this.card).toPromise()
    .then(() => this._router.navigate(['/CardDetails', { code: this.card.code }]))
    .catch(error => console.error(error));

  }

  removeCard() {

    this.isLoading = true;
    this._apiService.removeCard(this.card.code).toPromise()
    .then(() => this._router.navigate(['/Cards']))
    .catch(error => console.error(error));

  }

  addText() {

    this.card.texts[this.text.type].push(this.text.content);
    this.initialiseText();

  }

  addIllustration() {

    this.card.illustrations.push(this.illustration);
    this.initialiseIllustration();

  }

  addKeyword() {

    this.card.keywords.push(this.keyword);
    this.keyword = '';

  }

  initialiseCard() {

    const texts = {};
    this.textTypes.forEach(textType => {

      texts[textType] = [];

    });

    this.card = {
      code: '',
      name: '',
      type: 0,
      expansion: 0,
      faction: 0,
      cost: 0,
      strength: 0,
      power: 0,
      keywords: [],
      defaultIllustration: 0,
      illustrations: [],
      texts,
      publishDate: new Date().toISOString().split('T')[0]
    };
    this.keyword = '';

  }

  initialiseIllustration() {

    this.illustration = {
      code: '',
      artistName: '',
      note: ''
    };

  }

  initialiseText() {

    this.text = {
      type: this.textTypes[0],
      content: ''
    };

  }

  removeIllustration(index) {

    if (index > 0 && this.card.defaultIllustration >= index) {

      this.card.defaultIllustration--;

    }

    this.card.illustrations.splice(index, 1);

  }

  removeText(type, index) {

    this.card.texts[type].splice(index, 1);

  }

  removeKeyword(index) {

    this.card.keywords.splice(index, 1);

  }

  editIllustration(index) {

    Object.assign(this.illustration, this.card.illustrations[index]);
    this.card.illustrations.splice(index, 1);

  }

  editText(type, index) {

    this.text.content = this.card.texts[type][index];
    this.text.type = type;
    this.card.texts[type].splice(index, 1);

  }

  canAddKeyword() {

    return this.keyword.length && this.card.keywords.indexOf(this.keyword) === -1;

  }

  showField(column) {

    if (this.card !== undefined && this.card !== null) {

      switch (column) {
        case 'cost':
          return ['Character', 'Token', 'Gear', 'Resource', 'Action', 'Summon'].map(type => this.cardTypes.indexOf(type)).indexOf(this.card.type) !== -1;
        case 'strength':
          return ['Character', 'Token', 'Gear'].map(type => this.cardTypes.indexOf(type)).indexOf(this.card.type) !== -1;
        case 'power':
          return ['Character', 'Token', 'Gear', 'Pantheon', 'Summon'].map(type => this.cardTypes.indexOf(type)).indexOf(this.card.type) !== -1;
        default:
          return false;
      }

    }
    return false;

  }
}

export default AdminCardHomeComponent;
