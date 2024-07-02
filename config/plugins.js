module.exports = ({ env }) => ({
    email: {
        config: {
            provider: 'strapi-provider-email-resend',
            providerOptions: {
                apiKey: process.env.RESEND_API_KEY, // Required
            },
            settings: {
                defaultFrom: 'AndreiPavel.toader@gmail.com',
                defaultReplyTo: 'AndreiPavel.toader@gmail.com',
            },
        }
    },
});