const express = require("express");
const PostController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");
const extractFile = require('../middleware/file')

// const e = require("express");

const router = express.Router();



router.post(
  "",
  checkAuth, //da um check no jsonwebtoken se ele é valido
  extractFile, //MULTER
  PostController.createPost //Controler
);

router.put(
  "/:id",
  checkAuth, //da um check no jsonwebtoken se ele é valido
  extractFile, //multer
  PostController.updatePost
);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete(
  "/:id",
  checkAuth, //da um check no jsonwebtoken se ele é valido para deletar
  PostController.deletePost
);

module.exports = router;
