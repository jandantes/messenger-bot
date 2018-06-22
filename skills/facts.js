require('dotenv').config();
const wiki = require('wikijs').default;
const logger = require('../server/logger');
const { cantFindAnswer } = require('../server/messages');

const facts = source => wiki().find(source)
  .then((page) => {
    const { summary, raw } = page;
    return summary().then((details) => {
      const shortDetails =
        `${details.substr(0, 1000)}... (Wikipedia: ${raw.fullurl})`;
      return shortDetails;
    });
  })
  .catch((err) => {
    logger.info(`wiki error: ${err}`);
    return cantFindAnswer;
  });

module.exports = facts;
