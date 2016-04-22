import { Component } from 'angular2/core';
import { Router } from 'angular2/router';
import template from './index.html';
import styles from './index.scss';
import { MaWPediaApiService } from '~/src/client/services/';
import { MdButton } from '@angular2-material/button';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';

@Component({
  directives: [MD_CARD_DIRECTIVES, MD_INPUT_DIRECTIVES, MdButton],
  selector: 'login',
  styles: [styles],
  template
})
class LoginHomeComponent {
  constructor(router, apiService) {

    this._router = router;
    this._apiService = apiService;
    if (this._apiService.isLogged()) {

      this._router.navigate(['/Cards']);

    }

  }

  async onSubmit() {

    try {

      await this._apiService.login(this.token);
      this._router.navigate(['/Cards']);

    } catch (error) {

      console.error(error);

    }

  }
}
LoginHomeComponent.parameters = [[Router], [MaWPediaApiService]];

export default LoginHomeComponent;
