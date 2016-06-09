import { Component } from '@angular/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import routes from '~/src/routes.js';
import template from './index.html';
import styles from './index.scss';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdProgressBar } from '@angular2-material/progress-bar';
import { MdAnchor } from '@angular2-material/button';
import { RouterLinkle } from '~/src/client/directives/';
import { MaWPediaApiService } from '~/src/client/services/';

@Component({
  directives: [ROUTER_DIRECTIVES, MdAnchor, MdToolbar, MdProgressBar, RouterLinkle],
  selector: 'mawpedia-root',
  styles: [styles],
  template
})
@RouteConfig(routes)
class RootComponent {

  static parameters = [[Router], [MaWPediaApiService]];

  constructor(router, apiService) {

    this._router = router;
    this._apiService = apiService;

  }

  isLogged = () => this._apiService.isLogged();
  isLoading = () => this._apiService.isLoading();

  onLogout() {

    this._apiService.logout();
    this._router.navigate(['/Cards']);

  }
}

export default RootComponent;
