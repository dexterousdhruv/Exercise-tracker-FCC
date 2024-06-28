const { default: mongoose } = require("mongoose")
require('dotenv').config()


const connectDB = async (req, res) => {
  return mongoose.connect(process.env.MONGODB_URI)
}

module.exports = connectDB