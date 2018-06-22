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

const traffic = () => {
  const params = {
    user_id: '171574926',
    count: 10,
    include_rts: true,
    exclude_replies: true,
  };
  return twitterClient.get('statuses/user_timeline', params)
    .then((tweets) => {
      if (tweets.length) {
        const updates = tweets.map(a => a.text);
        updates.push('Source: @Official MMDA (https://twitter.com/MMDA)');
        return updates.join('\n\n');
      }
      return noUpdatesMessage;
    })
    .catch((err) => {
      logger.info(`twitter error: ${err}`);
      return noUpdatesMessage;
    });
};

module.exports = traffic;
