exports.validateAuth = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        msg: error.message || "Validation failed",
        data: [],
      });
    }
  };
};
