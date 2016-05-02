export function objForEach(fn, object) {

  if (typeof object !== 'object' || typeof fn !== 'function') {

    throw new TypeError('Invalid parameters');

  }

  Object.keys(object).forEach(key => fn(object[key], key, object));

}

export function objEvery(fn, object) {

  if (typeof object !== 'object' || typeof fn !== 'function') {

    throw new TypeError('Invalid parameters');

  }

  return Object.keys(object).every(key => fn(object[key], key, object));

}

export function objSome(fn, object) {

  if (typeof object !== 'object' || typeof fn !== 'function') {

    throw new TypeError('Invalid parameters');

  }

  return Object.keys(object).some(key => fn(object[key], key, object));

}
