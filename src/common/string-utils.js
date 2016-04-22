export function sanitizeForSearch(input) {

  return input.trim()
  .toLowerCase()
  .replace(/à|á|ä|â/, 'a')
  .replace(/è|é|ë|ê/, 'e')
  .replace(/ì|í|ï|î/, 'i')
  .replace(/ò|ó|ö|ô/, 'o')
  .replace(/ù|ú|ü|û/, 'u');

}
