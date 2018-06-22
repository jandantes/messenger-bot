const NOTIFICATION_TYPE = 'REGULAR';

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const NAME = dev ? process.env.NAME_DEV : process.env.NAME;
const { getStartedMessage, getStartedInfo, getStartedSkills } = require('./messages');

const sendMessage = (messenger, userId, message) => {
  const { subtitle, imageUrl } = message || {};
  if (subtitle && subtitle === 'image') {
    return messenger.sendImageMessage(userId, imageUrl, NOTIFICATION_TYPE);
  }
  return messenger.sendTextMessage(userId, message, NOTIFICATION_TYPE);
};

const getStarted = async (messenger, userId) => {
  messenger.getUserProfile(userId, (err, profile) => {
    const { first_name: firstName } = profile;
    const message = `Hi ${firstName}! I'm ${NAME}, ${getStartedMessage}`;

    /*
    const replies = [
      {
        content_type: 'text',
        title: 'Ask for rescue',
        payload: 'rescue',
      },
      {
        content_type: 'text',
        title: 'List keywords',
        payload: 'keywords',
      },
    ];
    messenger.sendQuickReplies(userId, message, replies);
    */
    // messenger.sendTextMessage(userId, message, NOTIFICATION_TYPE);
    setTimeout(() => {
      messenger.sendTextMessage(userId, message, NOTIFICATION_TYPE);
    }, 2000);

    setTimeout(() => {
      messenger.sendTextMessage(userId, getStartedInfo, NOTIFICATION_TYPE);
    }, 8000);

    setTimeout(() => {
      messenger.sendTextMessage(userId, getStartedSkills, NOTIFICATION_TYPE);
    }, 12000);
  });
};

module.exports = {
  getStarted,
  sendMessage,
};
