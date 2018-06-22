require('dotenv').config();

const Twitter = require('twitter');
const logger = require('../server/logger');
const { noUpdatesMessage } = require('../server/messages');

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET,
} = process.env;

const twitterClient = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
});

const fuel = () => {
  const params = {
    user_id: '360426140',
    count: 10,
    include_rts: false,
  };
  return twitterClient.get('statuses/user_timeline', params)
    .then((tweets) => {
      if (tweets.length) {
        const updates = tweets.map(a => a.text);
        updates.push('Source: @Petrol_Price (https://twitter.com/Petrol_Price)');
        return updates.join('\n\n');
      }
      return noUpdatesMessage;
    })
    .catch((err) => {
      logger.info(`twitter error: ${err}`);
      return noUpdatesMessage;
    });
};

module.exports = fuel;
