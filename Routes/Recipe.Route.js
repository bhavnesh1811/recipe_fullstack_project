const express = require("express");
const jwt = require("jsonwebtoken");
const { RecipeModel } = require("../Models/Recipe.Model");

const RecipeRoute = express.Router();

RecipeRoute.get("/", (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "bhavnesh", async (err, decoded) => {
      if (decoded) {
        // console.log(decoded)
        const { userID } = decoded;
        // console.log(userID);
        const recipe = await RecipeModel.find({ user: userID });
        res.status(200).send(recipe);
      }
    });
  } else {
    res.status(401).send({ msg: "User not allowed" });
  }
});

RecipeRoute.post("/addrecipe", async (req, res) => {
  const payload = req.body;
  try {
    const recipe = new RecipeModel(payload);
    await recipe.save();

    res.status(200).send({ msg: "Recipe Added" });
  } catch (e) {
    res.status(500).send({ msg: "Recipe not Added", err: e.message });
  }
});

RecipeRoute.delete("/delete/:id", async (req, res) => {
  const Id = req.params.id;
  try {
    await RecipeModel.findByIdAndDelete({ _id: Id });
    res.status(200).send({ msg: `Recipe with _id==> ${Id} deleted` });
  } catch (e) {
    res.status(500).send({ msg: "Recipe Not deleted", error: e.message });
  }
});

RecipeRoute.patch("/update/:id", async (req, res) => {
  const Id = req.params.id;
  const payload = req.body;
  try {
    let data = await RecipeModel.findByIdAndUpdate({ _id: Id }, payload);
    let updatedData = await RecipeModel.findById({ _id: Id });
    res
      .status(200)
      .send(`Recipe data==> \n\n${data} \n\nupdated to \n\n ${updatedData}`);
  } catch (e) {
    res.status(500).send({ msg: "Recipe not Updated", error: e.message });
  }
});

module.exports = { RecipeRoute };
