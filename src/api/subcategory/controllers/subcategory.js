// @ts-nocheck
'use strict';

/**
 * subcategory controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subcategory.subcategory', ({ strapi }) => ({
    async getFormattedSubcategories(ctx) {
        try {
            const subcategories = await strapi.entityService.findMany('api::subcategory.subcategory', {
                fields: ['name'], // Fetch only the name field
            });

            // Extract and return an array of subcategory names
            const subcategoryNames = subcategories.map(subcategory => subcategory.name);
            ctx.body = subcategoryNames;
        } catch (error) {
            ctx.body = error;
            ctx.status = 500;
        }
    },
}));    