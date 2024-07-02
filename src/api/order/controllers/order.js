// @ts-nocheck
'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
    async findUserOrders(ctx) {
        try {
            const { userId } = ctx.params;      

           
            const orders = await strapi.entityService.findMany('api::order.order', {
                filters: { user: userId }, 
                populate: ['products'], 
            });

   

            ctx.body = orders;
        } catch (error) {
            ctx.body = error;
            ctx.status = 500;
        }
    },
}));