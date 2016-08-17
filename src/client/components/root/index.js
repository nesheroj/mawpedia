import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdProgressBar } from '@angular2-material/progress-bar';
import { MdAnchor } from '@angular2-material/button';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { MaWPediaApiService } from '~/src/client/services/';
import template from './index.html';
import styles from './index.scss';

@Component({
  directives: [ROUTER_DIRECTIVES, MdAnchor, MdToolbar, MdProgressBar],
  selector: 'mawpedia-root',
  styles: [styles],
  template
})
class RootComponent {

  static parameters = [[Router], [TranslateService], [MaWPediaApiService]];
  realm = window.location.hostname.split('.')[0];

  constructor(router, translate, apiService) {

    translate.setDefaultLang('mawpedia');
    translate.use(this.realm);
    this._router = router;
    this._apiService = apiService;

  }

  isLogged = () => this._apiService.isLogged();
  isLoading = () => this._apiService.isLoading();

  onRoot(event) {

    if (!this._router.isActive('/', true) && event.which !== 2) {

      event.preventDefault();
      this._router.navigate(['/']);

    }

  }

  onLogout() {

    this._apiService.logout();
    this._router.navigate(['/']);

  }
}

export default RootComponent;
