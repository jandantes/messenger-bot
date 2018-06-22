const { cantUnderstand } = require('../server/messages');

const talk = (recastClient, conversationId, message) => {
  const { build } = recastClient;
  return build.dialog({ type: 'text', content: message }, { conversationId })
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

module.exports = talk;
