const { checkSchema } = require('express-validator');
const { isString } = require('lodash');

const loginSchema = {
  name: {
    in: 'body',
    isString: true,
    trim: true,
    optional: false,
    errorMessage: "name is mandatory parameter"
  },
  password: {
    in: 'body',
    isString: true,
    trim: true,
    optional: false,
    errorMessage: "password is mandatory parameter"
  },
};

const loginValidator = checkSchema(loginSchema);

module.exports = loginValidator
