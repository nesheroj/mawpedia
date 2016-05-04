import { Component } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import template from './index.html';
import styles from './index.scss';
import { MaWPediaApiService } from '~/src/client/services/';
import { MdButton } from '@angular2-material/button';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { Title } from '@angular/platform-browser';

@Component({
  directives: [MD_CARD_DIRECTIVES, MD_INPUT_DIRECTIVES, MdButton],
  selector: 'login',
  styles: [styles],
  template
})
class LoginHomeComponent {

  static parameters = [[Router], [Title], [MaWPediaApiService]];

  constructor(router, titleService, apiService) {

    this._router = router;
    this._apiService = apiService;
    if (this._apiService.isLogged()) {

      this._router.navigate(['/Cards']);

    }
    titleService.setTitle(`MaWpedia - Admin access`);

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

export default LoginHomeComponent;
