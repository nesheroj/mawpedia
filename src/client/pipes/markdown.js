
import { Injectable, Pipe } from '@angular/core';
import Remarkable from 'remarkable';

const remarkable = new Remarkable();

@Pipe({ name: 'mpmarkdown' })
@Injectable()
export default class MaWPediaMarkdownPipe {
  transform(value) {

    if (typeof value !== 'string') {

      return value;

    }
    return remarkable.render(value || '');

  }

}
