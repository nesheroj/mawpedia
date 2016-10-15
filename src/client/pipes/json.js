import { Injectable, Pipe } from '@angular/core';

function toJsonReplacer(key, value) {

  let val = value;

  if (value && value.window === value) {

    val = '[window]';

  } else if (value && document && document === value) {

    val = '[window.document]';

  }

  return val;

}

@Pipe({ name: 'mpjson', pure: false })
@Injectable()
export default class {
  transform(value, args = [2]) {

    if (typeof value === 'undefined') {

      return undefined;

    }
    return JSON.stringify(value, toJsonReplacer, args[0] || 2);

  }

}
