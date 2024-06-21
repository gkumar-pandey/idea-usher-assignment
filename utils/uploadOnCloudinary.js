const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_API_SECRET_KEY = process.env.CLOUD_API_SECRET_KEY;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET_KEY,
});

const uploadOnCloudinary = async (localFile) => {
  try {
    if (!localFile) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFile, {
      resource_type: "auto",
    });

    return response;
  } catch (error) {
    fs.unlinkSync(localFile); // remove if uplaod failed
    console.log(error);
    return null;
  }
};

module.exports = uploadOnCloudinary;
