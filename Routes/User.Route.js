const express = require("express");
const { UserModel } = require("../Models/User.Model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The user name
 *           required: true
 *         email:
 *           type: string
 *           description: The user email
 *           required: true
 *         pass:
 *           type: string
 *           description: Password of the user
 *           required: true
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User Registeration
 *     requestBody:
 *       description: User object that needs to be added to the database
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - pass
 *     responses:
 *       '200':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *       '400':
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: string
 *                   description: Error details
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: string
 *                   description: Error details
 */


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user with email and password
 *     tags: 
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *             required:
 *               - email
 *               - pass
 *     responses:
 *       '200':
 *         description: Login Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Login Successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySURfaWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       '401':
 *         description: Unauthorized Access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Wrong Credentials
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Something Went Wrong
 *                 error:
 *                   type: string
 *                   example: Database Error
 */



UserRouter.post("/register", async (req, res) => {
  const { name, email, pass } = req.body;
  const user = await UserModel.find({ email });
  if (user.length === 0) {
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (err) {
        res
          .status(500)
          .send({ msg: "Something Went Wrong", error: err.message });
      } else {
        try {
          const user = new UserModel({ name, email, pass: hash });
          await user.save();
          res.status(200).send({ msg: "User Registeration Sucessful" });
        } catch (e) {
          res
            .status(400)
            .send({ msg: "Something Went Wrong", error: e.message });
        }
      }
    });
  } else {
    res.status(200).send({ msg: "Email is already Registered" });
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
