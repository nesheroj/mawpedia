import { Directive } from 'angular2/core';
import { RouterLink } from 'angular2/router';

@Directive({
  selector: '[routerLinkle]',
  inputs: ['routeParams: routerLinkle', 'target: target'],
  host: {
    '(click)': 'onClick($event)',
    '[attr.href]': 'visibleHref',
    '[class.router-link-active]': 'isRouteActive'
  }
})
export default class RouterLinkle extends RouterLink {
  constructor(router, location) { /* eslint no-useless-constructor: [0] */

    super(router, location);

  }
  onClick(e) {

    if (e.ctrlKey || e.metaKey || e.button === 1) {

      return true;

    }
    return super.onClick();

  }
}
