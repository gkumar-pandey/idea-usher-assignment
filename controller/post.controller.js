const Post = require("../model/post");
const Tag = require("../model/tag");

/**
 * @route POST /api/v1/posts
 * @description create a new post and store in database.
 * @param {Object} req Express Request Object contains post title,description and image in body.
 * @param {Object} res Express response object contains created post or error.
 * @returns JSON response contains either success or error message.
 */
const createNewPostHandler = async (req, res) => {
  try {
    const { title, description, image, tags } = req.body;

    const newTags = [];

    tags.forEach(async (tag) => {
      const newTag = new Tag.create({
        tag: tag,
      });
      await newTag.save();
      newTags.push(newTag._id);
    });

    const newPost = new Post.create({
      title: title,
      description: description,
      image: image,
      tags: newTags,
    });
    await newPost.save();

    return res
      .status(201)
      .json({ success: true, message: "Post Created.", post: newPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Intenal server error.", error });
  }
};

module.exports = { createNewPostHandler };
