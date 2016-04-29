import { Component } from 'angular2/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import routes from '~/src/routes.js';
import template from './index.html';
import styles from './index.scss';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdButton } from '@angular2-material/button';
import { RouterLinkle } from '~/src/client/directives/';
import { MaWPediaApiService } from '~/src/client/services/';

@Component({
  directives: [ROUTER_DIRECTIVES, MdButton, MdToolbar, RouterLinkle],
  selector: 'mawpedia-root',
  styles: [styles],
  template
})
@RouteConfig(routes)
class RootComponent {
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
RootComponent.parameters = [[Router], [MaWPediaApiService]];

export default RootComponent;
