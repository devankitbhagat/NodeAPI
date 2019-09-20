const { checkSchema } = require('express-validator');
const { isString } = require('lodash');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const blockSchema = {
  userId: {
    in: 'body',
    isString: true,
    trim: true,
    optional: false,
    errorMessage: "userId is mandatory parameter and should be ObjectId",
    custom: {
      options: value => {
        return ObjectId.isValid(value)
      }
    }
  }
};

const blockValidator = checkSchema(blockSchema);

module.exports = blockValidator
