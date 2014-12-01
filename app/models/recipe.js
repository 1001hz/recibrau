//app/models/recipe.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RecipeSchema = new Schema({
    username: { type: String, required: true },
    recipeName: { type: String, required: true },
    recipeData: { type: String, required: true },
    updated: { type: String }
});

module.exports = mongoose.model('Recipe', RecipeSchema);