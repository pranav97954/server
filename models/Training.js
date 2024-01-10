const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  project:String,
  duration:String,
  contact:Number,
});

const TrainingModel = mongoose.model("trainingform", TrainingSchema);
module.exports = TrainingModel;