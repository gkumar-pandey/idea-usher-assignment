const express = require("ep");
const postRoute = require("./post.route");
const routes = express.Router();

routes.use("/posts", postRoute);

module.exports = routes;
