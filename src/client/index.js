import 'babel-polyfill';
import 'zone.js';
import '!!style!css!@angular/material/core/theming/prebuilt/indigo-pink.css';
import '!!style!css!sass!./index.scss';
import { NgModule, enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { TranslateModule, TranslateLoader } from 'ng2-translate/ng2-translate';
import mawpediaComponents from './components';
import mawpediaRoutes from './routes';
import mawpediaServices from './services/';
import mawpediaPipes from './pipes/';
import mawpediaLanguagesLoader from './i18n/';
import RootComponent from './components/root/';

if (__PRODUCTION__) {

  enableProdMode();

}

@NgModule({
  declarations: [
    RootComponent,
    ...mawpediaComponents,
    ...mawpediaPipes
  ],
  entryComponents: [
    RootComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(mawpediaRoutes),
    TranslateModule.forRoot({ provide: TranslateLoader, useClass: mawpediaLanguagesLoader }),
    Angulartics2Module.forRoot()
  ],

  providers: [
    Title,
    Angulartics2GoogleAnalytics,
    ...mawpediaServices
  ],
  bootstrap: [RootComponent]
})
class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
