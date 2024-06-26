module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/chat-assistant',
      handler: 'chat-assistant.chatAssistant',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
