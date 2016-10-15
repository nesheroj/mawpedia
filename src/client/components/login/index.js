import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MaWPediaApiService } from '../../services/';
import template from './index.html';
import styles from './index.scss';

@Component({
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

      this._router.navigate(['/']);

    }
    // titleService.setTitle(`MaWpedia - Admin access`);

  }

  async onSubmit() {

    try {

      await this._apiService.login(this.token);
      this._router.navigate(['/']);

    } catch (err) {

      console.error(err);

    }

  }
}

export default LoginHomeComponent;
