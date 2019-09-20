const { validationResult } = require('express-validator');
const { first } = require('lodash');

const validateParam = async (req, res, next) => {
  const validateError = validationResult(req);
  if (validateError.errors.length > 0) {
    const errObj = {};
    validateError.errors.forEach(er => {
      if (er.param) {
        errObj[er.param] = {
          name: 'ValidationError',
          message: er.msg,
          value: er.value,
          path: er.location,
        };
      }
    });

    res.json({
      status: 300,
      message: "Validation Error",
      data: {},
      errors: validateError
    })
  } else {
    next();
  }
};

module.exports = validateParam
