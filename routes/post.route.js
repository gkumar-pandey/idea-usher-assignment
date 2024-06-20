const express = require("express");
const { createNewPostHandler } = require("../controller/post.controller");
const postRoute = express.Router();

postRoute.post("/", createNewPostHandler);

module.exports = postRoute;
