const { body, validationResult } = require("express-validator");

module.exports = {
  createValidation: [
    body("date").not().isEmpty(),
    body("date").trim(),
    body("time").not().isEmpty(),
    body("time").trim(),
    body("distance").not().isEmpty(),
    body("distance").trim(),
    body("user_id").not().isEmpty(),
  ],
  catchValidationErrors: (req, res, next) => {
    const errorsObj = validationResult(req);
    if (errorsObj.errors.length) {
      res
        .status(400)
        .json({ message: "Invalid Info!", data: errorsObj.errors });
    } else {
      next();
    }
  },
};
