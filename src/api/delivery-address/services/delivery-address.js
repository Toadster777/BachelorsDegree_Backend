'use strict';

/**
 * delivery-address service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::delivery-address.delivery-address');
