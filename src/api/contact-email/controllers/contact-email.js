'use strict';

/**
 * A set of functions called "actions" for `contact-email`
 */

module.exports = {
  emailRequests: async (ctx, next) => {
    try {
      const res = await strapi
        .service("api::contact-email.contact-email")
        .emailService(ctx);
      ctx.body = JSON.stringify(res.message);
    } catch (err) {
      ctx.body = err;
    }
  },
};
