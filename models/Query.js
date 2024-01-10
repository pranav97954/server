const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const querySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  replies: [replySchema], // Array of replies
}, { timestamps: true });

const QueryModel = mongoose.model('Query', querySchema);

module.exports = QueryModel;