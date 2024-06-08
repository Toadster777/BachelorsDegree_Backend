'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::product.product');



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
        "method": "GET",
        "path": "/products/filter",
        "handler": "product.filter",
        "config": {
            "policies": []
        }
    },
    {
        method: 'GET',
        path: '/products/search',
        handler: 'product.search',
        config: {
            description: 'Search products',
            notes: 'Returns all products whose name includes the search parameter',
            tags: ['api', 'product']
        }
    },
    {
        "method": "GET",
        "path": "/products/generateFiltersData",
        "handler": "product.generateFiltersData",
        "config": {
            "policies": []
        }
    },
    {
        "method": "POST",
        "path": "/products/find-by-ids",
        "handler": "product.findProductsByIds",
        "config": {
            "policies": []
        }
    }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
