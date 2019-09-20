const { checkSchema } = require('express-validator');
const { isString } = require('lodash');

const getListSchema = {
  page: {
    in: 'body',
    isNumeric: true,
    trim: true,
    optional: true,
    errorMessage: "page should be a number"
  },
  limit: {
    in: 'body',
    isNumeric: true,
    trim: true,
    optional: true,
    errorMessage: "limit should be a number (number of docs to return)"
  },
};

const getListValidator = checkSchema(getListSchema);

module.exports = getListValidator
