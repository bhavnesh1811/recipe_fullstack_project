const express = require("express");
require("dotenv").config();
const { connection } = require("./Configs/db");
const { authentication } = require("./Middlewares/authentication");
const { RecipeRoute } = require("./Routes/Recipe.Route");
const { UserRouter } = require("./Routes/User.Route");
const swaggerJSdoc=require("swagger-jsdoc")
const swaggerUi=require("swagger-ui-express")
const cors=require("cors")
const server = express();
server.use(cors({
  origin:"*"
}))
server.use(express.json());

const options={
  definition:{
  openapi:"3.0.0",
  info:{
  title:"Learning Swagger",
  version:"1.0.0"
  },
  servers:[
  {
  url:"http://localhost:8080"
  }
  ]
  },
  apis:["./routes/*.js"]
  }
  const swaggerSpec=swaggerJSdoc(options)
  server.use("/docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))

server.get("/", (req, res) => {
  res.status(200).send("Welcome To HomePage");
});

server.use("/users", UserRouter);
server.use(authentication);
server.use("/recipes", RecipeRoute);

server.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (e) {
    console.log("Not Connected to DB");
  }
  console.log(`Server is running on port ${process.env.port}`);
});


