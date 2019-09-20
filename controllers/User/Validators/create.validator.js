const { checkSchema } = require('express-validator');
const { isString } = require('lodash');

const createSchema = {
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

const createValidator = checkSchema(createSchema);

module.exports = createValidator
