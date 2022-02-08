const { body, validationResult } = require("express-validator");
let currentDate = new Date();
module.exports = {
  createValidation: [
    body("date.year").not().isEmpty(),
    body("date.year").trim(),
    body("date.year").isFloat({ max: currentDate.getFullYear() }),
    body("date.year").isFloat({ min: 2000 }),
    body("date.month").not().isEmpty(),
    body("date.month").trim(),
    body("date.month").isFloat({ max: currentDate.getMonth() + 1 }),
    body("date.year").isFloat({ min: 1 }),
    body("date.day").not().isEmpty(),
    body("date.day").trim(),
    body("date.day").isFloat({ max: currentDate.getDate() }),
    body("date.year").isFloat({ min: 1 }),
    body("time").not().isEmpty(),
    body("time").trim(),
    body("distance").not().isEmpty(),
    body("distance").trim(),
  ],
  fitlerByDateValidation: [
    body("from.year").not().isEmpty(),
    body("from.year").trim(),
    body("from.year").isFloat({ max: currentDate.getFullYear() }),
    body("from.year").isFloat({ min: 2000 }),
    body("from.month").not().isEmpty(),
    body("from.month").trim(),
    body("from.month").isFloat({ max: currentDate.getMonth() + 1 }),
    body("from.year").isFloat({ min: 1 }),
    body("from.day").not().isEmpty(),
    body("from.day").trim(),
    body("from.day").isFloat({ max: currentDate.getDate() }),
    body("from.year").isFloat({ min: 1 }),
    body("to.year").not().isEmpty(),
    body("to.year").trim(),
    body("to.year").isFloat({ max: currentDate.getFullYear() }),
    body("to.year").isFloat({ min: 2000 }),
    body("to.month").not().isEmpty(),
    body("to.month").trim(),
    body("to.month").isFloat({ max: currentDate.getMonth() + 1 }),
    body("to.year").isFloat({ min: 1 }),
    body("to.day").not().isEmpty(),
    body("to.day").trim(),
    body("to.day").isFloat({ max: currentDate.getDate() }),
    body("to.year").isFloat({ min: 1 }),
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
