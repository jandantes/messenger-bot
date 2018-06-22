const moment = require('moment-timezone');

moment.tz('Asia/Manila');

const User = require('../models/user');
const Sms = require('../models/sms');
const Semaphore = require('../server/semaphore');
const logger = require('../server/logger');

require('dotenv').config();

const smsSender = new Semaphore();

const { SEMAPHORE_SENDER } = process.env;

const {
  invalidSMSFormat,
  forMembersOnly,
  smsTesting,
  noSmsTesting,
  errorSms,
  thresholdMessage,
  wentWrong,
  profileNotFound,
} = require('../server/messages');

const sms = (userId, userMessage) =>
  new Promise((resolve, reject) => {
    // /rescue 09171234567/manila, luneta park/abc123/putol timing belt
    const SMS_PATTERN = /^((09)\d{9}\/[^/]*\/[^/]*\/[^/]*)$/;
    const MOBILE_PATTERN = /^(09)\d{9}$/;
    const details = userMessage.split('/rescue ').pop();
    const mobileNo = details.split('/')[0];
    const isValidPattern = SMS_PATTERN.test(details);
    const isValidMobile = MOBILE_PATTERN.test(mobileNo);
    const invalid = !isValidMobile || !isValidPattern;
    const hasTest = details.includes('test');

    if (invalid) return reject(invalidSMSFormat);
    if (hasTest) return reject(noSmsTesting);

    const payload = {
      from: SEMAPHORE_SENDER,
    };

    return User.findOne({ userId })
      .then((doc) => {
        if (!doc) return reject(forMembersOnly);
        payload.to = doc.mobileNo;
        payload.message = userMessage;
        return Sms.findOne({ userId }, {}, { sort: { created: -1 } })
          .then((smsDetails) => {
            if (smsDetails) {
              const afterThreshold = moment()
                .isAfter(moment(smsDetails.created)
                  .add(30, 'minutes'));
              if (!afterThreshold) return reject(thresholdMessage);
            }
            return smsSender.sendsms(payload)
              .then(() =>
                Sms.create({ userId, message: userMessage })
                  .then(() => resolve(smsTesting))
                  .catch((err) => {
                    logger.info(`save sms error: ${err}`);
                    return reject(wentWrong);
                  }))
              .catch((err) => {
                logger.info(`sms error: ${err}`);
                return reject(errorSms);
              });
          }).catch((err) => {
            logger.info(`find recent sms error: ${err}`);
            return reject(wentWrong);
          });
      })
      .catch((err) => {
        logger.info(`sms find user error: ${err}`);
        return reject(profileNotFound);
      });
  }).catch(err => err);

module.exports = sms;
