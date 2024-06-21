const Post = require("../model/post");
const Tag = require("../model/tag");
const uploadOnCloudinary = require("../utils/uploadOnCloudinary");

/**
 * @route POST /api/v1/posts
 * @description create a new post and store in database.
 * @param {Object} req Express Request Object contains post title,description and image in body.
 * @param {Object} res Express response object contains created post or error.
 * @returns JSON response contains either success or error message.
 */
const createNewPostHandler = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const file = req.file;

    const tagsArray = JSON.parse(tags);

    let imageUrl = "";

    if (file) {
      const res = await uploadOnCloudinary(file.path);

      imageUrl = res?.url;
    }

    const newTags = await Promise.all(
      tagsArray.map(async (tag) => {
        try {
          const isTagExist = await Tag.findOne({ tag: tag });

          if (isTagExist) {
            return isTagExist._id;
          }

          const newTag = await Tag.create({ tag });
          return newTag._id;
        } catch (error) {
          console.error(`Error creating tag: ${tag}`, error);
          throw error;
        }
      })
    );

    const newPost = await Post.create({
      title: title,
      description: description,
      imageUrl: imageUrl,
      tags: newTags,
    });
    await newPost.save();

    const createdPost = await Post.findById(newPost._id).populate("tags");

    return res
      .status(201)
      .json({ success: true, message: "Post Created.", post: createdPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Intenal server error.", error });
  }
};

/**
 * @route GET /api/v1/posts
 * @description fetch all posts based on query like page, limit,tag,sort and keyword.
 * @param {Object} req Express Request object with query data.
 * @param {Object} res Express Response Object contains posts data.
 * @returns JSON response object contains either error or success message.
 */
const retrievePostsHandler = async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, sort, keyword } = req.query;

    const query = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (tag) {
      const tagDoc = await Tag.findOne({ tag: tag });
      if (tagDoc) {
        query.tags = tagDoc._id;
      } else {
        return res.status(404).json({ message: "Tag not found" });
      }
    }

    const posts = await Post.find(query)
      .sort(sort ? { [sort]: 1 } : {})
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("tags");

    return res.status(200).json({ success: true, posts: posts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error.", error });
  }
};

/**
 * @route DELETE /api/v1/posts/:postId
 * @description Delete the post from database.
 * @param {Object} req Express request object contains post id in params;
 * @param {Object} res Express response object contains success message.
 * @returns JSON response with either success or error message.
 */
const deletePostByIdHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const isPostExist = await Post.findById(postId);

    if (!isPostExist) {
      return res
        .status(404)
        .json({ success: false, message: "Post Does not exist." });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ success: true, message: "Post Deleted." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error,
    });
  }
};

module.exports = {
  createNewPostHandler,
  retrievePostsHandler,
  deletePostByIdHandler,
};
