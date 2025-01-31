const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
}, { versionKey : false }
)

const User = model('User', userSchema)

module.exports = User