const express = require("express");
const { UserModel } = require("../Models/User.Model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserRouter = express.Router();

UserRouter.post("/register", async (req, res) => {
  const { name, email, pass } = req.body;
  const user = await UserModel.find({ email });
  if(user.length===0){
      bcrypt.hash(pass, 5, async (err, hash) => {
        if (err) {
          res.status(500).send({ msg: "Something Went Wrong", error: err.message });
        } else {
          try {
            const user = new UserModel({ name, email, pass: hash });
            await user.save();
            res.status(200).send({ msg: "User Registeration Sucessful" });
          } catch (e) {
            res.status(400).send({ msg: "Something Went Wrong", error: e.message });
          }
        }
      });

  }else{
    res.status(200).send({ msg: "Email is already Registered"});
  }
});
UserRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(pass, user[0].pass, (err, result) => {
        if (result) {
          let token = jwt.sign({ userID: user[0]._id }, "bhavnesh");
          res.status(200).send({ msg: "Login Suceessful", token: token });
        } else {
          res.status(200).send({ msg: "Wrong Credentials" });
        }
      });
    } else {
      res.status(200).send({ msg: "Wrong Credentials" });
    }
  } catch (e) {
    res.send({ msg: "Something Went Wrong", error: e.message });
  }
});

module.exports = { UserRouter };
