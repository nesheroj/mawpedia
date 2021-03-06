import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MaWPediaApiService } from '../../services/';
import { MaWPediaJSONPipe } from '../..//pipes/';
import { objSome } from '../../../common/object-utils';
import * as enums from '../../../common/enums';
import template from './index.html';
import styles from './index.scss';

@Component({
  pipes: [MaWPediaJSONPipe],
  selector: 'admin-card',
  styles: [styles],
  template
})
class AdminCardHomeComponent {

  static parameters = [[Router], [ActivatedRoute], [Title], [MaWPediaApiService]];

  cardTypes = enums.cardTypes;
  textTypes = enums.textTypes;
  cardExpansions = enums.cardExpansions[window.location.hostname.split('.')[0] === 'mawpedia' ? 'mawpedia' : 'mitopedia'];
  cardFactions = enums.cardFactions;
  isLoading = true;

  constructor(router, route, titleService, apiService) {

    this._router = router;
    this._apiService = apiService;
    this.initialiseCard();
    this.initialiseIllustration();
    this.initialiseText();
    this.code = route.snapshot.params.code;
    // titleService.setTitle(this.code ? `MaWpedia - Edit Card` : `MaWpedia - Create Card`);

    if (!this._apiService.isLogged()) {

      this._router.navigate(['/']);

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
    .then(() => this._router.navigate(['/cards', this.card.code.toUpperCase()]))
    .catch(err => {

      this.isLoading = false;
      console.error(err);

    });

  }

  removeCard() {

    this.isLoading = true;
    this._apiService.removeCard(this.card.code).toPromise()
    .then(() => this._router.navigate(['/']))
    .catch(err => console.error(err));

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

  addArtist() {

    this.illustration.artists.push(this.artist);
    this.artist = '';

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
      publishDate: '' // new Date().toISOString().split('T')[0]
    };
    this.keyword = '';

  }

  initialiseIllustration() {

    this.illustration = {
      code: '',
      artists: [],
      note: ''
    };
    this.artist = '';

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

  removeArtist(index) {

    this.illustration.artists.splice(index, 1);

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

    return this.keyword.length && !this.card.keywords.includes(this.keyword);

  }

  canAddArtist() {

    return this.artist.length && !this.illustration.artists.includes(this.artist);

  }

  showField(column) {

    if (this.card !== undefined && this.card !== null) {

      switch (column) {
        case 'cost':
          return ['Character', 'Token', 'Gear', 'Resource', 'Action', 'Summon'].map(type => this.cardTypes.indexOf(type)).includes(this.card.type);
        case 'strength':
          return ['Character', 'Token', 'Gear'].map(type => this.cardTypes.indexOf(type)).includes(this.card.type);
        case 'power':
          return ['Character', 'Token', 'Gear', 'Pantheon', 'Summon'].map(type => this.cardTypes.indexOf(type)).includes(this.card.type);
        default:
          return false;
      }

    }
    return false;

  }
}

export default AdminCardHomeComponent;
