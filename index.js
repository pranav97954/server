const http = require("http");
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const UserModel = require('./models/User');
const CareerModel = require('./models/Career');

require("dotenv").config();

//Video section
const multer = require('multer');
const VideoModel = require('./models/Video');
const sanitizeFilename = require('sanitize-filename');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Query
const QueryModel = require('./models/Query');

 
// Update MongoDB connection URI
const MONGODB_URI = 'mongodb+srv://pranavkumar97954:zlVxT7INPRW8Sjbi@cluster0.gi6fh6q.mongodb.net/akash?retryWrites=true&w=majority';
mongoose.connect(process.env.MONGODB_URI || MONGODB_URI, {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});
const PORT = process.env.PORT || 3000;

app.get('/get-queries', async (req, res) => {
  try {
    const queries = await QueryModel.find().exec();
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/post-query', async (req, res) => {
  const { query } = req.body;

  try {
    const newQuery = new QueryModel({ text: query });
    const savedQuery = await newQuery.save();
    res.json(savedQuery);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/post-reply/:queryId', async (req, res) => {
  const { queryId } = req.params;
  const { reply } = req.body;

  try {
    const query = await QueryModel.findById(queryId);

    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }

    // Create a new reply
    const newReply = { text: reply };
    query.replies = [...(query.replies || []), newReply];

    // Save the updated query with the new reply
    await query.save();

    res.json(newReply);
  } catch (error) {
    console.error('Error posting reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// const server = http.createServer((req,res) =>{
//   res.writeHead(200,{"Content-Type": "text/plain"});
//   res.end("Hello world!");
// });

app.listen(PORT,() => console.log("Server is running on port 3000"));