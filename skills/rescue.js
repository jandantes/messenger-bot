const { cantUnderstand } = require('../server/messages');

const rescue = (recastClient, uuid, conversationId, userMessage) => {
  const { build } = recastClient;
  return build.dialog({ type: 'text', content: userMessage }, { conversationId })
    .then((dialogResponse) => {
      const { messages } = dialogResponse;
      if (messages.length) {
        const randomReply = messages[Math.floor(Math.random() * messages.length)];
        const { content } = randomReply;
        return content;
      }
      return cantUnderstand;
    });
};

module.exports = rescue;
