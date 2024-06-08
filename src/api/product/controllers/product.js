// @ts-nocheck
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
    async filter(ctx) {
        const query = ctx.query;
        const subcategoryName = query.subcategory;
        delete query.subcategory;

        // Fetch all products and populate the fields from the dynamic zone
        const products = await strapi.entityService.findMany('api::product.product', { populate: ['subcategorySpecificAttributes', 'subcategory', 'cardPhoto',] });

        // Filter products by subcategory
        let filteredProducts = products.filter(product => product.subcategory.slug === subcategoryName);

        // If other query parameters were provided, filter the products further
        if (Object.keys(query).length > 0) {
            filteredProducts = filteredProducts.filter(product => {
                // Check each field-value pair in the query parameters
                for (let [field, values] of Object.entries(query)) {
                    // If the values are not in an array, put them in one
                    if (!Array.isArray(values)) {
                        values = [values];
                    }

                    // If any attribute in the dynamic zone has the field and one of the values matches, continue to the next field-value pair
                    let attributeMatch = false;
                    for (const attribute of product.subcategorySpecificAttributes) {
                        if (attribute[field] && values.includes(attribute[field])) {
                            attributeMatch = true;
                            break;
                        }
                    }

                    // If the current field-value pair did not match any attribute, return false
                    if (!attributeMatch) {
                        return false;
                    }
                }

                // If all field-value pairs matched, return true
                return true;
            });
        }

        return filteredProducts;
    },

    async search(ctx) {
        const searchParam = ctx.query.searchParam;

        // Check if searchParam is defined
        if (!searchParam) {
            return ctx.throw(400, 'searchParam is required');
        }

        // Fetch all products
        const products = await strapi.entityService.findMany('api::product.product', { populate: ['subcategorySpecificAttributes', 'subcategory', 'cardPhoto',] });

        // Filter products by name
        const filteredProducts = products.filter(product =>
            product.name && product.name.toLowerCase().includes(searchParam.toLowerCase())
        );

        return filteredProducts;
    },

    async generateFiltersData(ctx) {
        const subcategoryName = ctx.query.subcategory;

        // Fetch all products and populate the fields from the dynamic zone
        const products = await strapi.entityService.findMany('api::product.product', { populate: ['subcategorySpecificAttributes', 'subcategory', 'cardPhoto',] });

        // Filter products by subcategory
        const filteredProducts = products.filter(product => product.subcategory.slug === subcategoryName);

        // If no productsData, return null
        if (!filteredProducts) {
            return null;
        }

        let specificationHeadings = [];
        filteredProducts.forEach((product) => {
            Object.keys(product?.subcategorySpecificAttributes[0]).slice(2).forEach(element => {
                if (element.includes("_filterable")) {
                    specificationHeadings.push(element);
                }
            })
        })

        specificationHeadings = [...new Set(specificationHeadings)];

        let filters = []; // Initialize filters here

        specificationHeadings?.forEach((head) => {
            let uniqueValues = new Set(); // Use a set to track unique values

            filteredProducts?.forEach(product => {
                Object.entries(product?.subcategorySpecificAttributes[0]).slice(2).forEach(attribute => {
                    if (attribute[0] === head) {
                        // Add the attribute value to the set
                        uniqueValues.add(attribute[1]);
                    }
                })
            });

            // After the inner loop, push the current filter to filters
            filters.push({
                name: head,
                values: Array.from(uniqueValues)
            });
        });

        return filters; // Return filters after the outer loop
    },
    async findProductsByIds(ctx) {
        // Get the array of product IDs from the request body
        const productIds = ctx.request.body.ids;

        // Check if productIds is defined and is an array
        if (!productIds || !Array.isArray(productIds)) {
            return ctx.throw(400, 'Product IDs are required and should be an array');
        }

        // Fetch products with the provided IDs
        const products = await strapi.db.query('api::product.product').findMany({
            where: {
                id: productIds
            },
            populate: ['cardPhoto',]
        });

        return products;
    }


}));