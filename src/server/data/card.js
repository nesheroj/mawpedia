import { findOne, scan, upsert, del } from '~/src/server/core/redis';

export function getCards() {

  return scan({
    match: 'cards:*'
  }).then(result => result.map(card => JSON.parse(card)));

}

export function getCardByCode(code) {

  const cardKey = `cards:${code}`;

  return findOne(cardKey)
    .then(result => result === null ? Promise.reject() : JSON.parse(result));

}

export function upsertCard(cardDocument) {

  const cardKey = `cards:${cardDocument.code}`;

  return upsert(cardKey, JSON.stringify(cardDocument))
    .then(() => getCardByCode(cardDocument.code));

}

export function removeCard(code) {

  const cardKey = `cards:${code}`;

  return del(cardKey);

}
