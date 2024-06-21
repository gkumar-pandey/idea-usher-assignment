const globalErrorMiddleware = (err, req, res, next) => {
  res.status(500).json({ error: "Something went wrong!" });
};

const routeNotFoundMiddleware = (req, res, next) => {
  res.status(404).json({ error: "Route not found" });
};

module.exports = { globalErrorMiddleware, routeNotFoundMiddleware };
