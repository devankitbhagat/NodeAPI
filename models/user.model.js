const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-beautiful-unique-validation');
var mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
      type: String,
      required: true,
      trim: true
  },
  token: {
    type: String,
    trim: true,
  },
  profileImage: {
    type: String,
    trim: true,
    default: "https://api.adorable.io/avatars/100/1.png"
  },
  blockedBy: {
		type: [
			{
				type: mongoose.Types.ObjectId
			}
		]
  }
})

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(mongoosePaginate);

const UserModel =  mongoose.model("User", UserSchema, "users" )
module.exports = UserModel
