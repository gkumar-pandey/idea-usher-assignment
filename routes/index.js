const express = require("express");
const postRoute = require("./post.route");
const routes = express.Router();

routes.use("/posts", postRoute);

routes.get("/", (req, res) => {
  return res.status(200).json("Server is running.");
});

module.exports = routes;
