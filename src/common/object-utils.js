export function objForEach(input, fn) {

  if (typeof input !== 'object' || typeof fn !== 'function') {

    throw new TypeError('Invalid parameters');

  }

  Object.keys(input).forEach(key => fn(input[key], key, input));

}
