require('dotenv').config();

const Recastai = require('recastai').default;

const { RECAST_ACCESS_TOKEN } = process.env;
const recastClient = new Recastai(RECAST_ACCESS_TOKEN, 'en');
const { request } = recastClient;
const dev = process.env.NODE_ENV !== 'production';
const logger = require('./logger');
const { keywordInvalid, hotlineNumbers } = require('./messages');

const {
  facts,
  fuel,
  traffic,
  jokes,
  talk,
  rescue,
  sms,
  register,
} = require('../skills/index');

const KEYWORDS = [
  '/rescue',
  '/register',
  '/hotline',
];

const KEYWORD_PATTERN = /^(\/([a-zA-Z0-9]+))/;

const replyTextMessage = (messenger, userId, userMessage) => {
  const conversationId = userId;
  const temp = userMessage.toLowerCase();
  const checkKeyword = temp.split(' ')[0];
  const isKeyword = KEYWORD_PATTERN.test(checkKeyword);

  const urgent = temp.includes('/rescue');
  const reg = temp.includes('/register');
  const hotline = temp.includes('/hotline');

  const isValidKeyword = isKeyword ? KEYWORDS.includes(checkKeyword) : false;

  if (isKeyword && !isValidKeyword) {
    const invalidKeyword = new Promise(resolve => resolve(keywordInvalid));
    return invalidKeyword;
  }

  if (urgent) {
    return sms(conversationId, temp);
  }

  if (reg) {
    return register(conversationId, temp);
  }

  if (hotline) {
    const hotlines = new Promise(resolve => resolve(hotlineNumbers));
    return hotlines;
  }

  return request.analyseText(userMessage)
    .then((analyseResponse) => {
      const intent = analyseResponse.intent();
      const { source, uuid } = analyseResponse;
      const { slug } = intent || {};

      if (dev) {
        // logger.info(analyseResponse);
        logger.info(intent);
      }

      switch (slug) {
        case 'ask-facts':
        case 'define': return facts(source);
        case 'fuel': return fuel();
        case 'traffic': return traffic();
        case 'ask-joke': return jokes();
        case 'rescue': return rescue(recastClient, uuid, conversationId, userMessage);
        default: return talk(recastClient, conversationId, userMessage);
      }
    });
};

module.exports = {
  replyTextMessage,
};
