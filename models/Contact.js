const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  requirement:String,
  location:String,
  contact:Number,
});

const ContactModel = mongoose.model("contactform", ContactSchema);
module.exports = ContactModel;