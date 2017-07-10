import koaRouter from 'koa-router';
import * as enums from '../../common/enums';
import { sanitizeForSearch } from '../../common/string-utils';
import { validateRequest } from '../core/validation';
import { checkAuth } from '../core/auth';
import {
  getCards,
  getCardByCode,
  removeCard,
  upsertCard
} from '../data/card';
import { cardCreateRequest } from '../schemas/card';

const PAGE_SIZE = 15;

const router = koaRouter({ prefix: '/cards' });

const isPublishedBefore = currentDate => card => card.publishDate.length && currentDate >= new Date(card.publishDate);

const isFactionVisible = realm => card => enums.hiddenFactions[realm].length === 0 || !enums.hiddenFactions[realm].includes(card.faction);

router.get('/byartist/:artistName', checkAuth(), async (ctx, next) => {

  let total = 0;
  const currentDate = new Date();

  await getCards(ctx.state.realm)
    .then(cards => ctx.state.isAuthorised ? cards : cards.filter(isFactionVisible(ctx.state.realm) && isPublishedBefore(currentDate)))
    .then(cards => cards.reduce((acc, card) => {

      card.illustrations = card.illustrations.filter(illustration => illustration.artists.includes(ctx.params.artistName));
      return card.illustrations.length > 0 ? [...acc, card] : acc;

    }, []))
    .then(cards => ctx.query.filters ? cards.filter(processFilters(JSON.parse(ctx.query.filters))) : cards)
    .then(cards => ctx.query.sortBy ? cards.sort(compareCardsBy(ctx.query.sortBy, !!ctx.query.reverse)) : cards)
    .then(cards => {

      const offset = Number(ctx.query.offset) || 0;
      total = cards.length;
      return cards.slice(offset, offset + PAGE_SIZE);

    })
    .then(cards => {

      ctx.status = 200;
      ctx.body = { cards, total };

    }, err => ctx.throw(404, 'Not Found', err));

});

router.get('/', checkAuth(), async (ctx, next) => {

  let total = 0;
  const currentDate = new Date();

  await getCards(ctx.state.realm)
    .then(cards => ctx.state.isAuthorised ? cards : cards.filter(isFactionVisible(ctx.state.realm) && isPublishedBefore(currentDate)))
    .then(cards => ctx.query.filters ? cards.filter(processFilters(JSON.parse(ctx.query.filters))) : cards)
    .then(cards => ctx.query.sortBy ? cards.sort(compareCardsBy(ctx.query.sortBy, !!ctx.query.reverse)) : cards)
    .then(cards => {

      const offset = Number(ctx.query.offset) || 0;
      total = cards.length;
      return cards.slice(offset, offset + PAGE_SIZE);

    })
    .then(cards => {

      ctx.status = 200;
      ctx.body = { cards, total };

    }, err => ctx.throw(404, 'Not Found', err));

});

router.get('/:code', checkAuth(), async (ctx, next) => {

  const currentDate = new Date();

  await getCardByCode(ctx.state.realm, ctx.params.code)
    .then(resultDocument => {

      if (ctx.state.isAuthorised || (isFactionVisible(ctx.state.realm)(resultDocument) && isPublishedBefore(currentDate)(resultDocument))) {

        ctx.status = 200;
        ctx.body = resultDocument;

      } else {

        ctx.throw(404, 'Not Found');

      }

    }, err => ctx.throw(404, 'Not Found', err));

});

router.post('/', checkAuth(true), validateRequest(cardCreateRequest), async (ctx, next) => {

  const requestPayload = ctx.request.body;
  const resultCode = requestPayload._created ? 200 : 201;

  const resultDocument = await upsertCard(ctx.state.realm, requestPayload)
    .catch(err => ctx.throw(503, 'There was a problem creating the card.', err));

  ctx.status = resultCode;
  ctx.body = resultDocument;

});

router.del('/:code', checkAuth(true), async (ctx, next) => {

  await removeCard(ctx.state.realm, ctx.params.code)
    .then(resultDocument => {

      ctx.status = 200;
      ctx.body = { code: ctx.params.code };

    }, err => ctx.throw(404, 'Not Found', err));

});

export default router;

function processFilters(filters) {

  const sanitizedTerm = sanitizeForSearch(filters.term || '');

  return card => {

    let pass = filters.term === '' || sanitizeForSearch(card.code).includes(sanitizedTerm) || sanitizeForSearch(card.name).includes(sanitizedTerm);

    if (!pass && !!filters.extendedSearch) {

      pass = filters.term === '' || Object.keys(card.texts).some(cardType => card.texts[cardType].some(cardText => sanitizeForSearch(cardText).includes(sanitizedTerm)) || card.keywords.some(keyword => sanitizeForSearch(keyword).includes(sanitizedTerm)));

    }

    if (filters.textType) {

      pass = pass && card.texts[filters.textType].length > 0;

    }

    pass = pass && ['type', 'expansion', 'faction'].every(field => typeof filters[field] === 'undefined' || filters[field].some(filter => Number(filter) === card[field]));

    return pass;

  };

}

function compareCardsBy(field, reverse) {

  // Default sort function
  const sorter = (a, b) => {

    if (a > b) {

      return 1;

    }
    if (a < b) {

      return -1;

    }

    return 0;

  };

  switch (field) {
    case 'type':
      return (a, b) => reverse ? sorter(enums.cardTypes[a[field]], enums.cardTypes[b[field]]) : sorter(enums.cardTypes[b[field]], enums.cardTypes[a[field]]);
    case 'expansion':
      return (a, b) => reverse ? sorter(enums.cardExpansions[a[field]], enums.cardExpansions[b[field]]) : sorter(enums.cardExpansions[b[field]], enums.cardExpansions[a[field]]);
    case 'faction':
      return (a, b) => reverse ? sorter(enums.cardFactions[a[field]], enums.cardFactions[b[field]]) : sorter(enums.cardFactions[b[field]], enums.cardFactions[a[field]]);
    default:
      return (a, b) => reverse ? sorter(a[field], b[field]) : sorter(b[field], a[field]);
  }

}
