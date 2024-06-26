// @ts-nocheck
'use strict';

/**
 * subcategory router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::subcategory.subcategory');

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
        path: '/subcategories/formatted',
        handler: 'subcategory.getFormattedSubcategories',
        config: {
            policies: [],
            middlewares: [],
        },
    },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);





