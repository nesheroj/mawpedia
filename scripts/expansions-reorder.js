import Joi from 'joi';
import { getCards, upsertCard } from '../src/server/data/card';
import { cardCreateRequest } from '../src/server/schemas/card';

global.__DEVELOPMENT__ = true;

const delayBy = time => new Promise((resolve, reject) => setTimeout(() => resolve(), time));

async function migrateCardsForReam(realm) {

  const realmCards = await getCards(realm);

  return realmCards.reduce(async (acc, card) => {

    let cardModified = false;

    await acc;

    if (card.code.indexOf('12') !== 0 && card.expansion === 11) {

      card.expansion = 0;

    } else if (card.code.indexOf('12') === 0) {

      card.expansion = 12;

    } else if (card.code.indexOf('11') === 0) {

      card.expansion = 11;

    } else {

      card.expansion++;

    }

    cardModified = true;

    // if (card.code.indexOf('11') !== 0 && card.expansion === 10) {

    //   console.log(card.code, card.expansion, card.name);

    // }

    const validatedCard = Joi.attempt(card, cardCreateRequest, { stripUnknown: true });

    if (!cardModified) {

      return Promise.resolve();

    }

    try {

      await upsertCard(realm, validatedCard);

    } catch (err) {

      console.error(err, validatedCard);

    }

    return delayBy(50);

  }, Promise.resolve());

}

Promise.all([migrateCardsForReam('mitopedia')])
.then(() => global.process.exit());
