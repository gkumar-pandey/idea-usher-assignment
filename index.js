const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const routes = require("./routes");
const {
  globalErrorMiddleware,
  routeNotFoundMiddleware,
} = require("./middleware/error.middleware");
const connectDb = require("./config/db");

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

connectDb();

app.use("/api/v1/", routes);

app.get("/", (req, res) => {
  return res.status(200).json("Server is Running.");
});

app.use(globalErrorMiddleware);
app.use(routeNotFoundMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at PORT:${PORT}`);
});
