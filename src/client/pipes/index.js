import MaWPediaJSONPipe from './json';
import MaWPediaMarkdownPipe from './markdown';
import MaWPediaCapitalisePipe from './capitalise';

export {
  MaWPediaJSONPipe,
  MaWPediaCapitalisePipe,
  MaWPediaMarkdownPipe
};
export default [
  [MaWPediaJSONPipe],
  [MaWPediaCapitalisePipe],
  [MaWPediaMarkdownPipe]
];
