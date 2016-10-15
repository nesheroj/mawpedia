import { Injectable, Pipe } from '@angular/core';

@Pipe({ name: 'split' })
@Injectable()
export default class {
  transform(value, [separator] = [';']) {

    if (typeof value !== 'string') {

      return value;

    }
    return value.split(separator);

  }

}
