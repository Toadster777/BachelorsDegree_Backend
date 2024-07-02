'use strict';

/**
 * contact-email service
 */

module.exports = ({ strapi }) => ({
    emailService: async (ctx) => {
        try {
            const input = ctx.request.body?.message;
            const name = ctx.request.body?.lastName + " " + ctx.request.body?.firstName;
            const emailFrom = ctx.request.body?.email;
            await strapi.plugins["email"].services.email.send({
                from: "onboarding@resend.dev",
                to: "atoader777@gmail.com",
                subject: `Cerere de contact de la ${emailFrom ? emailFrom : "un utilizator"}`,
                html: `<h1>${name}:</h1>
                <p>${input}</p>`,
            });

            return {
                "message": "Email trimis!",
            };
        } catch (err) {
            ctx.body = err;
        }
    },
});