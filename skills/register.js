const User = require('../models/user');
const logger = require('../server/logger');

const {
  alreadyRegistered,
  invalidRegisterFormat,
  registrationThanks,
  profileNotFound,
  wentWrong,
} = require('../server/messages');

const register = (conversationId, userMessage) =>
  new Promise((resolve, reject) => {
  // /register 09171234567/juan@yourcompany.com
    const REG_PATTERN = /^((09)\d{9}\/[^/]*)$/;
    const MOBILE_PATTERN = /^(09)\d{9}$/;
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const details = userMessage.split('/register ').pop();
    const userDetails = details.split('/');
    const mobileNo = userDetails[0];
    const emailAddress = userDetails[1];
    const isValidPattern = REG_PATTERN.test(details);
    const isValidMobile = MOBILE_PATTERN.test(mobileNo);
    const isValidEmail = EMAIL_PATTERN.test(emailAddress);
    const invalid = !isValidMobile || !isValidEmail || !isValidPattern;

    if (invalid) return reject(invalidRegisterFormat);

    return User.findOne({ mobileNo, emailAddress })
      .then(function(doc) { // eslint-disable-line
        if (!doc) {
          return reject(profileNotFound);
        }

        if (doc && doc.userId) {
          return reject(alreadyRegistered);
        }

        doc.userId = conversationId; // eslint-disable-line no-param-reassign
        doc.save().then(function() { // eslint-disable-line
          resolve(registrationThanks);
        });
      }).catch((err) => {
        logger.info(`register user error: ${err}`);
        reject(wentWrong);
      });
  }).catch(err => err);

module.exports = register;
