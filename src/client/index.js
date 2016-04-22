import 'babel-polyfill';
import 'zone.js';
import 'reflect-metadata';
import '!!style!css!sass!./index.scss';
// import {
//   bootstrap,
//   // enableProdMode,
//   BROWSER_ROUTER_PROVIDERS,
//   BROWSER_HTTP_PROVIDERS
// } from 'angular2-universal';
import { bootstrap, Title } from 'angular2/platform/browser';
import { FORM_PROVIDERS } from 'angular2/common';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';
import { ELEMENT_PROBE_PROVIDERS } from 'angular2/platform/common_dom';
import RootComponent from './components/root/';
import MAWPEDIA_SERVICES from './services/';
import MAWPEDIA_PIPES from './pipes/';

if (__DEVELOPMENT__) {

  console.clear();

} else {

  // enableProdMode();

}

document.addEventListener('DOMContentLoaded', () => {

  bootstrap(RootComponent, [
    Title,
    FORM_PROVIDERS,
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    ELEMENT_PROBE_PROVIDERS,
    MAWPEDIA_PIPES,
    MAWPEDIA_SERVICES
  ]);

});
