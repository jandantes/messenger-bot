const rp = require('request-promise-native');
const logger = require('../server/logger');
const { cantFindJokes } = require('../server/messages');

const options = {
  url: 'https://icanhazdadjoke.com/',
  headers: {
    Accept: 'application/json',
  },
  json: true,
};

const jokes = () => rp(options)
  .then((data) => {
    const { joke } = data;
    return joke;
  })
  .catch((err) => {
    logger.info(`jokes error: ${err}`);
    return cantFindJokes;
  });

module.exports = jokes;
