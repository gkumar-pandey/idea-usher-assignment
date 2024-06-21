const mongoose = require("mongoose");

const connectDb = async () => {
  const DB_USER = process.env.DB_USER;
  const DB_PASSWORD = process.env.DB_PASSWORD;
  const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@neog.a4r4b3k.mongodb.net/?retryWrites=true&w=majority&appName=Neog`;
  try {
    const connect = await mongoose.connect(dbURL);
    if (connect) {
      console.log("Database connected successfully....");
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDb;
