const cheerio = require("cheerio");
const axios = require("axios");
const readline = require('readline');
const fs = require('fs');

const { RECIPE_URL } = require('../config/config');
// const APIError = require('../utils/APIError.utils');
// const BlueApronRecipeLinks = require('../assets/BlueApronRecipeLinks.txt');

module.exports = {
  fetchData: async endpoint => {
    console.log("attempting to fetch")
    console.log(`${RECIPE_URL}/${endpoint}`)

    let source = axios.CancelToken.source();
    setTimeout(() => {
      source.cancel();
      console.log("safety cancel")
    }, 100000);
    const result = await axios.get(`${RECIPE_URL}/${endpoint}`, { cancelToken: source.token });
    
    return cheerio.load(result.data, {
      xml: {
        normalizeWhitespace: true,
      }
    });
  },
  scrapeRecipe: async recipeNameId => {
    try {
      const $ = await module.exports.fetchData(`recipes/${recipeNameId}`);

      const recipe = {
        nameId: recipeNameId,
        author: '',
        category: '',
        cuisine: '',
        titleMain: '',
        titleSub: '',
        cookTimeMins: '',
        servings: '',
        calories: '',
        description: '',
        thumbnailUrl: '',
        mainImageUrl: '',
        ingredientsImageUrl: '',
        ingredients: new Set(),
        instructions: [],
        ratingCount: 0,
        ratingValue: 0,
      }

      recipe.author = $('meta[itemprop=author]').attr('content');
      recipe.category = $('meta[itemprop=recipeCategory]').attr('content');
      recipe.cuisine = $('meta[itemprop=recipeCuisine]').attr('content');
      recipe.titleMain = $('.ba-recipe-title__main').text().trim();
      recipe.titleSub = $('.ba-recipe-title__sub').text().trim();
  
      $('.ba-info-list__item').each((idx, el) => {
        let key = ''
        const val = $(el).find('.ba-info-list__item-value').text().match(/\d+/g);
        const lookUp = $(el).find('.ba-info-list__item-name').text().trim()

        if (lookUp === 'Time') key = 'cookTimeMins' 
        else if (lookUp === 'Servings') key = 'servings'
        else if (lookUp === 'Nutrition') key = 'calories'
        
        if (key && val) {
          recipe[key] = val[0]; 
        }
      })

      recipe.description = $('meta[name=description]').attr('content');
      recipe.thumbnailUrl = $("meta[itemprop='image thumbnailUrl']").attr('content');
      recipe.mainImageUrl = $('.ba-hero-image__hldr img').attr('src');
      recipe.ingredientsImageUrl = $('.ba-feature-image__hldr img').attr('src');
  
      $('.section-recipe .step .col-md-6').each((idx, el) => {
        const instruction = {
          step: 0,
          stepTitle: '',
          stepText: '',
          stepImage: ''
        }
  
        instruction.step = $(el).find('.step-number').text().trim();
        instruction.stepTitle = $(el).find('.step-title').text().trim();
        instruction.stepText = $(el).find('.step-txt').text().trim();
        instruction.stepImage = $(el).find('img').attr('src');
  
        recipe.instructions.push(instruction);
      })
  
      $('.ba-info-list .ba-info-list__item .non-story').each((idx, el) => {
        const ingredient = $(el).text().trim().replace(/\s\s+/g, ' ');
        recipe.ingredients.add(ingredient);
      });

      recipe.ratingCount = $('meta[itemprop=ratingCount]').attr('content');
      recipe.ratingValue = $('meta[itemprop=ratingValue]').attr('content');
  
      return {
        ...recipe,
        ingredients: [...recipe.ingredients]
      }
    } catch (err) {
      console.log("hey")
      return err;
    }
  },
  scrapeCookbook: async () => {
    try {
      const path = require('path').resolve(__dirname, '../assets/BlueApronRecipeLinks.txt')
      const readInterface = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        console: false
      });

      for await (let line of readInterface) {
        line = line.replace(/['"]+/g, '')
        await axios.get(`http://localhost:5000/api/recipes/${line}`);
      }
    }
    catch (err) {
      console.log(err)
    }
  }
}