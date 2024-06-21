const express = require("express");
const upload = require("../middleware/multer.middleware");

const {
  createNewPostHandler,
  retrievePostsHandler,
  deletePostByIdHandler,
} = require("../controller/post.controller");
const postRoute = express.Router();

postRoute.post("/", upload.single("image"), createNewPostHandler);

postRoute.get("/", retrievePostsHandler);

postRoute.delete("/:postId", deletePostByIdHandler);

module.exports = postRoute;
