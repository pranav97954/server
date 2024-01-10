const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  filename: String, // The filename of the video in the 'videos' folder
  description: String, // Additional information about the video
  folderName: String,
});

const VideoModel = mongoose.model('Video', VideoSchema);

module.exports = VideoModel;