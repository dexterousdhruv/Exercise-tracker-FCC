const { model, Schema } = require("mongoose");

const logSchema = new Schema({
  count: {
    type: Number,
    required: true,
  },
  _id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  log: {
    type: [{
      description: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      date: {
        type: Date, 
      },
    }]
  }
}, { versionKey : false }
)
 
const Log = model('Log', logSchema)

module.exports = Log
