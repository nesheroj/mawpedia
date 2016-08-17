import { Observable } from 'rxjs/Observable';

import mawpedia from './mawpedia.json';
import mitopedia from './mitopedia.json';

export default class {
  getTranslation(lang) {

    switch (lang) {
      case 'mitopedia':
        return Observable.of(mitopedia);

      default:
        return Observable.of(mawpedia);
    }

  }
}
