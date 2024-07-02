// @ts-nocheck
'use strict';

/**
 * order router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;


const defaultRouter = createCoreRouter('api::order.order');

const customRouter = (innerRouter, extraRoutes = []) => {
    let routes;
    return {
        get prefix() {
            return innerRouter.prefix;
        },
        get routes() {
            if (!routes) routes = extraRoutes.concat(innerRouter.routes);
            return routes;
        },
    };
};


const myExtraRoutes = [
    {
        method: 'GET',
        path: '/orders/user/:userId',
        handler: 'order.findUserOrders',
        config: {
            auth: false, // or true, depending on your authentication strategy
        },
    },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
