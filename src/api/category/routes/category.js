
'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
const defaultRouter = createCoreRouter('api::category.category');

const customRouter = (innerRouter, extraRoutes = []) => {
    let routes;
    return {
        get prefix() {
            return innerRouter.prefix;
        },
        get routes() {
            if (!routes) routes = innerRouter.routes.concat(extraRoutes);
            return routes;
        },
    };
};

const myExtraRoutes = [
    {
        "method": "GET",
        "path": "/categories/:id/subcategories",
        "handler": "category.findSubcategories",
        "config": {
            "policies": []
        }
    }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);