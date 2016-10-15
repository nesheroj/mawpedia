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

    card.illustrations = card.illustrations.map(illustration => {

      // Only transform if old format
      if (illustration.artistName) {

        const transformedIllustration = Object.assign({}, illustration);
        transformedIllustration.artists = [transformedIllustration.artistName];
        delete transformedIllustration.artistName;
        cardModified = true;

        return transformedIllustration;

      }

      return illustration;

    });

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

Promise.all([migrateCardsForReam('mitopedia'), migrateCardsForReam('mawpedia')])
.then(() => global.process.exit());
