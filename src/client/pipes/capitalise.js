import { Injectable, Pipe } from '@angular/core';

@Pipe({ name: 'mpcapitalise' })
@Injectable()
export default class MaWPediaCapitalisePipe {
  transform(value) {

    if (typeof value !== 'string') {

      return value;

    }
    return [value.slice(0, 1).toUpperCase(), value.slice(1)].join('');

  }

}
