import fetch from 'node-fetch';
import Joi from 'joi';
import * as enums from '../src/common/enums';
import { cardCreateRequest } from '../src/server/schemas/card';
import { upsertCard } from '../src/server/data/card';

global.__DEVELOPMENT__ = true;

const factionMap = {
  Japonesa: enums.cardFactions.indexOf('Japanese'),
  Nordica: enums.cardFactions.indexOf('Norse'),
  Azteca: enums.cardFactions.indexOf('Aztec'),
  Griega: enums.cardFactions.indexOf('Greek'),
  Egipcia: enums.cardFactions.indexOf('Egyptian'),
  Neutral: enums.cardFactions.indexOf('Neutral'),
  Primigenia: enums.cardFactions.indexOf('Primigenic'),
  Celta: enums.cardFactions.indexOf('Celtic'),
  Sumeria: enums.cardFactions.indexOf('Sumerian'),
  Hindu: enums.cardFactions.indexOf('Hindu'),
  Voodoo: enums.cardFactions.indexOf('Voodoo'),
  Nativos: enums.cardFactions.indexOf('Native american'),
  Romana: enums.cardFactions.indexOf('Roman')
};

const cardTypeMap = {
  panteon: enums.cardTypes.indexOf('Pantheon'),
  personaje: enums.cardTypes.indexOf('Character'),
  equipo: enums.cardTypes.indexOf('Gear'),
  accion: enums.cardTypes.indexOf('Action'),
  evento: enums.cardTypes.indexOf('Event'),
  recurso: enums.cardTypes.indexOf('Resource'),
  invocacion: enums.cardTypes.indexOf('Summon'),
  token: enums.cardTypes.indexOf('Token')
};

const delayBy = time => new Promise((resolve, reject) => setTimeout(() => resolve(), time));

fetch(`http://mitopedia.guerrademitos.com/api/cards`)
  .then(response => response.json())
  .then(cards => {

    return cards
      .reduce((acc, card) => {

        return acc.then(() => {

          const transformedCard = {
            code: card.code,
            name: card.name,
            type: cardTypeMap[card.type],
            expansion: enums.cardExpansions.mitopedia.indexOf(card.expansion),
            faction: factionMap[card.mythology],
            cost: Number(card.cost) || 0,
            strength: Number(card.strength) || 0,
            power: Number(card.power) || 0,
            keywords: card.keywords.length ? card.keywords.split(';') : [],
            defaultIllustration: 0,
            illustrations: ([card.code, ...card.image.length ? card.image.split(';') : []]).map(code => (
              {
                code,
                artistName: card.artistName,
                note: ''
              })
            ),
            texts: card.texts.reduce((acc, text) => {

              if (text.text.length > 0) {

                switch (text.type) {
                  case 'Influencia':
                    acc.Influence.push(text.text);
                    break;
                  case 'Flavor':
                    acc.Flavor.push(text.text);
                    break;
                  case 'General':
                    acc.General.push(text.text);
                    break;
                  case 'Enfrentamiento':
                    acc.Confrontation.push(text.text);
                    break;
                  case 'Historia':
                    acc.Lore.push(text.text);
                    break;
                  default:
                    acc.Notes.push(text.text);

                }

              }

              return acc;

            }, {
              Flavor: [],
              General: [],
              Influence: [],
              Confrontation: [],
              Lore: [],
              Notes: []
            }),
            publishDate: card.published === '1' ? '2016-08-17' : '2116-09-09'
          };

          // console.log(transformedCard);

          const validatedCard = Joi.attempt(transformedCard, cardCreateRequest, { stripUnknown: true });

          console.log(validatedCard);

          return upsertCard('mitopedia', validatedCard)
          .then(delayBy(500));

        });

      }, Promise.resolve());

  })
  .catch(err => console.error(err))
  .then(() => global.process.exit());
