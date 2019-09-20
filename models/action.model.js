const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ActionSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  onUserId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  actionType: {
    type: String,
    enum: [ 'like', 'super_like']
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const ActionModel =  mongoose.model("Action", ActionSchema, "actions" )
module.exports = ActionModel