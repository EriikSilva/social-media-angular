const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//ROTAS
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

//models
// const Post = require("./models/post");

const app = express();

mongoose
  .connect(
    //NOME DA DATABASE
    "mongodb+srv://erik:" + 
    process.env.MONGO_ATLAS_PW 
    +  "@cluster0.8u4gvkz.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connectado ao mongo databaase");
  })
  .catch(() => {
    console.log("conexão com o mongo falhou");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('D:/angular/mini-projeto/backend/images/')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "DELETE, POST, PUT, PATCH, GET, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use('/api/user', userRoutes);



module.exports = app;
