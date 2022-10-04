const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = "http://" + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
    // email:req.body.email
  });
  // console.log("@@@oq temos aqui => ", post._id);
  // console.log('@@requesteeeeeeee', req.userData)
  // return res.status(200).json({}
  //mongoose ja faz tudo automatico
  post
    .save()
    .then((result) => {
      console.log("@res do post backend", result);
      res.status(201).json({
        message: "post adicionaado",
        post: {
          //post.id
          ...result,
          id: result._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "falha ao criar o post",
        error: error,
      });
    });
  //console.log(posts)
};

exports.updatePost = (req, res, next) => {
  // console.log(req.file)

  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = "http://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });

  console.log(post);

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
        // console.log(result)
      console.log("@@Resultado do PUT", result);
      if (result.matchedCount > 0) { //modifiedCount
        res.status(200).json({ message: "atualizado com sucesso" });
      } else {
        res.status(401).json({ message: "Nao Autorizado ERRO NO ATUALZAR" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "algo deu errado ao atualizar",
        error: error,
      });
    });
};

exports.getPosts = (req, res, next) => {
  // console.log(req.query);

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();

  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).send({
        message: "todos os posts",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "falha ao pesquisar os posts",
        error: error,
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "erro: post não existe ou não foi encontrado" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "falha ao pesquisar o post",
        error: error,
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log("Res do DELETE BACKEND", result);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "deletado com sucesso" });
      } else {
        res.status(401).json({ message: "Nao Autorizado NO DELETAR" });
      }

      // res.status(200).json({ message: "Post deleted!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "erro ao deletar",
        error: error,
      });
    });
};
