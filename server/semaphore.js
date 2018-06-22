const rp = require('request-promise-native');

const logger = require('./logger');

require('dotenv').config();

const {
  SEMAPHORE_APIKEY,
  SEMAPHORE_ENDPOINT,
} = process.env;

function Semaphore() {
  if (!(this instanceof Semaphore)) {
    return new Semaphore();
  }

  // Set the headers
  const headers = {
    'User-Agent': 'Semaphore SMS/1.0.0.',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  this.headers = headers;
  this.apikey = SEMAPHORE_APIKEY;
  this.endpoint = SEMAPHORE_ENDPOINT;
}

Semaphore.prototype.sendsms = function sendsms(sms) {
  const data = {
    sendername: sms.from,
    apikey: this.apikey,
    number: sms.to,
    message: sms.message,
  };

  const options = {
    url: `${this.endpoint}/api/v4/messages`,
    method: 'POST',
    headers: this.headers,
    form: data,
  };

  return rp(options)
    .then(() => true)
    .catch((err) => {
      logger.info(`semaphore error: ${err}`);
      return false;
    });
};

module.exports = Semaphore;
