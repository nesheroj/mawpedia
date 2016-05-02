export function invertPromise(promise) {

  return promise.then(result => Promise.reject(result), err => err);

}
