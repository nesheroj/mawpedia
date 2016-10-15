import { findOne, scan, upsert, del } from '../core/redis';

export function getCards(realm) {

  return scan({
    match: `cards:${realm}:*`
  }).then(result => result.map(card => JSON.parse(card)));

}

export function getCardByCode(realm, code) {

  const cardKey = `cards:${realm}:${code}`;

  return findOne(cardKey)
    .then(result => result === null ? Promise.reject() : JSON.parse(result));

}

export function upsertCard(realm, cardDocument) {

  const cardKey = `cards:${realm}:${cardDocument.code}`;

  return upsert(cardKey, JSON.stringify(cardDocument))
    .then(() => getCardByCode(realm, cardDocument.code));

}

export function removeCard(realm, code) {

  const cardKey = `cards:${realm}:${code}`;

  return del(cardKey);

}
