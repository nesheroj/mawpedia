import 'babel-polyfill';
import 'zone.js';
import '!!style!css!@angular2-material/core/style/core.css';
import '!!style!css!@angular2-material/core/overlay/overlay.css';
import '!!style!css!sass!./index.scss';
import { NgModule, enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MdButtonToggleModule } from '@angular2-material/button-toggle/button-toggle';
import { MdButtonModule } from '@angular2-material/button/button';
import { MdCheckboxModule } from '@angular2-material/checkbox/checkbox';
import { MdRadioModule } from '@angular2-material/radio/radio';
import { MdSlideToggleModule } from '@angular2-material/slide-toggle/slide-toggle';
import { MdSliderModule } from '@angular2-material/slider/slider';
import { MdSidenavModule } from '@angular2-material/sidenav/sidenav';
import { MdListModule } from '@angular2-material/list/list';
import { MdGridListModule } from '@angular2-material/grid-list/grid-list';
import { MdCardModule } from '@angular2-material/card/card';
import { MdIconModule } from '@angular2-material/icon/icon';
import { MdProgressCircleModule } from '@angular2-material/progress-circle/progress-circle';
import { MdProgressBarModule } from '@angular2-material/progress-bar/progress-bar';
import { MdInputModule } from '@angular2-material/input/input';
import { MdTabsModule } from '@angular2-material/tabs/tabs';
import { MdToolbarModule } from '@angular2-material/toolbar/toolbar';
import { MdTooltipModule } from '@angular2-material/tooltip/tooltip';
import { MdRippleModule } from '@angular2-material/core/ripple/ripple';
import { PortalModule } from '@angular2-material/core/portal/portal-directives';
import { OverlayModule } from '@angular2-material/core/overlay/overlay-directives';
import { MdMenuModule } from '@angular2-material/menu/menu';
import { RtlModule } from '@angular2-material/core/rtl/dir';
import { TranslateModule, TranslateLoader } from 'ng2-translate/ng2-translate';
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
    ...mawpediaPipes
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(mawpediaRoutes),
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdProgressBarModule,
    MdProgressCircleModule,
    MdRadioModule,
    MdRippleModule,
    MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    OverlayModule,
    PortalModule,
    RtlModule,
    TranslateModule.forRoot({ provide: TranslateLoader, useClass: mawpediaLanguagesLoader })
  ],
  providers: [
    Title,
    ...mawpediaServices
  ],
  bootstrap: [RootComponent]
})
class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
