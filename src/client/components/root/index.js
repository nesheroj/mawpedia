import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { MdToolbar } from '@angular/material/toolbar';
import { MdProgressBar } from '@angular/material/progress-bar';
import { MdAnchor } from '@angular/material/button';
import { Title } from '@angular/platform-browser';
import { Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { MaWPediaApiService } from '../../services/';
import template from './index.html';
import styles from './index.scss';

@Component({
  directives: [ROUTER_DIRECTIVES, MdAnchor, MdToolbar, MdProgressBar],
  providers: [Angulartics2GoogleAnalytics],
  selector: 'mawpedia-root',
  styles: [styles],
  template
})
class RootComponent {

  static parameters = [[Router], [Title], [Angulartics2], [Angulartics2GoogleAnalytics], [TranslateService], [MaWPediaApiService]];
  realm = window.location.hostname.split('.')[0];

  constructor(router, titleService, angulartics2, angulartics2GoogleAnalytics, translate, apiService) { /* eslint max-params: [0] */

    translate.setDefaultLang('mawpedia');
    translate.use(this.realm);
    this._router = router;
    this._apiService = apiService;
    translate.get('MaWpedia').subscribe((res => titleService.setTitle(res)));

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
