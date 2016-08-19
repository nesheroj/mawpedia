import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Angulartics2 } from 'angulartics2';

@Injectable()
export class Angulartics extends Angulartics2 {

  static parameters = [[Location], [Router]];

  constructor(location, router) {

    super(location);
    router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        const url = location.path();
        this.trackUrlChange(url, location);

      }

    });

  }

}
