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
import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { Title, ELEMENT_PROBE_PROVIDERS } from '@angular/platform-browser';
import { FORM_PROVIDERS } from '@angular/common';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HTTP_PROVIDERS } from '@angular/http';
import RootComponent from './components/root/';
import MAWPEDIA_SERVICES from './services/';
import MAWPEDIA_PIPES from './pipes/';

if (__PRODUCTION__) {

  enableProdMode();

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
