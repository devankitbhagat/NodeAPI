const { checkSchema } = require('express-validator');
const { isString } = require('lodash');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const postSchema = {
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
  },
  actionType: {
    in: 'body',
    isString: true,
    trim: true,
    optional: false,
    isIn: {
      options: [['like', 'super_like']]
    },
    errorMessage: "actionType should be either like or super_like only"
  }
};

const postValidator = checkSchema(postSchema);

module.exports = postValidator
