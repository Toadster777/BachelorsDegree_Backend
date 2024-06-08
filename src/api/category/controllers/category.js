// @ts-nocheck
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::category.category", ({ strapi }) => ({
    async findSubcategories(ctx) {
        const { id } = ctx.params;
        const subcategories = await strapi.entityService.findMany('api::subcategory.subcategory', { filters: { category: id } });
        return subcategories;
    },
}))