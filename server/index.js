const express = require('express');
const mongoose = require('mongoose');

const Messenger = require('./messenger');
const logger = require('./logger');

require('dotenv').config();

const PORT = process.env.PORT || 8445;
const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = dev ? process.env.MONGO_URL_DEV : process.env.MONGO_URL;

const FB_PAGE_ACCESS_TOKEN = dev
  ? process.env.FB_PAGE_ACCESS_TOKEN_DEV
  : process.env.FB_PAGE_ACCESS_TOKEN;
const { FB_VERIFY_TOKEN } = process.env;

// Init
const messenger = new Messenger({
  page_token: FB_PAGE_ACCESS_TOKEN,
  verify_token: FB_VERIFY_TOKEN,
});

const bot = require('./bot');
const actions = require('./actions');

const app = express();

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
app.use('/webhook', messenger.middleware());

// Config the Get Started Button and register a callback
messenger.setGetStartedButton('GET_STARTED');
messenger.on('postback', (userId, payload) => {
  if (payload === 'GET_STARTED') {
    actions.getStarted(messenger, userId);
  }
});

// Setup listener for incoming messages
messenger.on('message', (userId, message) => {
  bot.replyTextMessage(messenger, userId, message)
    .then((reply) => {
      actions.sendMessage(messenger, userId, reply);
    }).catch((err) => {
      logger.info(`bot error: ${err}`);
    });
});

messenger.on('quickreply', (userId, payload) => {
  logger.info(`quickreply payload: ${payload}`);
});

app.listen(PORT);
logger.info(`PORT: ${PORT}`);
logger.info(`DB: ${MONGO_URL}`);
