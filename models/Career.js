const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  name: String,
  email: String,
  jobrole: String,
  location:String,
  contact:Number,
});

const CareerModel = mongoose.model("career", CareerSchema);
module.exports = CareerModel;