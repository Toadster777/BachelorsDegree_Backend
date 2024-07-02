module.exports = {
  routes: [
    {
      method: "POST",
      path: "/contact-email/emailRequests",
      handler: "contact-email.emailRequests",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};