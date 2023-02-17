const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  user: { type: String },
});

const RecipeModel = mongoose.model("recipe", recipeSchema);

module.exports = { RecipeModel };
