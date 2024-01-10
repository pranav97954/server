const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  subject:String,
  contact:Number,
});

const SubjectModel = mongoose.model("subjectform", SubjectSchema);
module.exports = SubjectModel;