// @ts-nocheck
'use strict';
const openai = require('../config/openai.js');
const APIUrl = process.env.API;
const clientHost = process.env.CLIENT_HOST;

module.exports = ({ env }) => ({
  async chatAssistant(ctx, next) {

    // Custom Functions

    async function retrieveSubcategorySpecificProductData(subcategoryName) {
      try {
        const response = await fetch(`${APIUrl}/products/generateFiltersData?subcategory=${subcategoryName}`, {
          headers: {},
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
      };
    }


    async function suggestFilterLink(filterSpecifications, filterSubcategoryName) {

      console.log(filterSubcategoryName);

      let queryParams = filterSpecifications.replace(/ /g, "%20").replace(/:/g, "=").replace(/,/g, "&");
      let link = `${clientHost}products/filter?subcategory=${filterSubcategoryName}&${queryParams}`
      return link;
    }

    async function processChatCompletion(chatCompletion, messages) {

      let content = {};


      if (chatCompletion.choices[0].message.function_call.name === 'retrieveSubcategorySpecificProductData') {
        let subcategoryName = JSON.parse(chatCompletion.choices[0].message.function_call.arguments).subcategoryName;
        // Use await to wait for the promise to resolve
        content = await retrieveSubcategorySpecificProductData(subcategoryName);
        content = JSON.stringify(content);
        // console.log(content);
        messages.push(chatCompletion.choices[0].message);
        // Ensure content is resolved before pushing
        messages.push({
          role: 'system',
          content: `Theese are product specficiations available on the website regarding the ${subcategoryName} products: ${content}. If certain specification values are missing, it means that the website does not have products with those values. When being asked to return a link, match the attribute names with the ones provided.`
        });
      }

      if (chatCompletion.choices[0].message.function_call.name === 'suggestFilterLink') {
        let filterSpecifications = JSON.parse(chatCompletion.choices[0].message.function_call.arguments).filterSpecifications;
        let filterSubcategoryName = JSON.parse(chatCompletion.choices[0].message.function_call.arguments).filterSubcategoryName;
        // Use await to wait for the promise to resolve
        content = await suggestFilterLink(filterSpecifications, filterSubcategoryName);
        content = JSON.stringify(content);

        messages.push(chatCompletion.choices[0].message);
        // Ensure content is resolved before pushing
        messages.push({
          role: 'system',
          content: content
        });

      }
      // console.log('Function call detected:', JSON.parse(chatCompletion.choices[0].message.function_call.arguments).subcategoryName);



      return messages;
    }

    // Custom Functions

    try {
      if (ctx) {

        // Assuming user input is in the request body under a "message" field
        const userInput = ctx.request.body.messages;
        let messages = userInput;
        const chatCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: userInput,
          functions: [
            {
              "name": "retrieveSubcategorySpecificProductData",
              "description": "Retrieve useful information about products in a certain subcategory, this information provides you with knowledge of what attribute values are available on the website . Use this function if the user is interested in a specific subcategory from the ones that you can talk about. The information will be returned in the form of a JSON object. The JSON object will contain the attributes that products can be filtered by and the available values for each attribute. For example 'name: 'Capacitate_MemorieRAM_filterable', values: ['8 GB', '32 GB']'. ",
              "parameters": {
                "type": "object",
                "properties": {
                  "subcategoryName": {
                    "type": "string",
                    "description": "The category that the user is interested in. Category name should be one of the ones provided. It must be a string. 'laptops'",
                  },
                },
                "required": ["subcategoryName"],
              },
            },
            {
              "name": "suggestFilterLink",
              "description": "This function returns a link to a page with products that match the filter specifications provided by you. Use this if the user is interested in a specific set of products and you want to provide them with a link to the filtered products. The link should be a string. For example: 'https://example.com/products?filter=price<1000&processor=i7'",
              "parameters": {
                "type": "object",
                "properties": {
                  "filterSpecifications": {
                    "type": "string",
                    "description": "The filter specifications based on your knowledge about available attributes and attribute values that fit the users request. For example: Dimensiune_Display_filterable:16inch etc.",
                  },
                  "filterSubcategoryName": {
                    "type": "string",
                    "description": "The subcategory name for which the filterSpecifications should be applied.  Subcategory name should be one of the ones prvoided in the system prompt. It must be a string. 'laptops'",
                  }
                },
                "required": ["filterSpecifications", "filterSubcategoryName"],
              },
            }
          ],
        });


        let wantsToUseFunction = chatCompletion.choices[0].finish_reason === 'function_call';
        if (wantsToUseFunction) {
          messages = await processChatCompletion(chatCompletion, messages);
          let functionData = [messages[messages.length - 1]]
          const chatCompletionWithFunc = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
          });

          functionData.unshift(chatCompletionWithFunc.choices[0].message);

          let response = functionData;

          console.log(response)

          ctx.body = { reply: response };
        }
        else {
          ctx.body = { reply: chatCompletion.choices[0].message };
        }


      }
    } catch (error) {
      console.error('Error during chat completion:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
});