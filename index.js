// const http = require("http");
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Query
const QueryModel = require('./models/Query');
const UserModel = require('./models/User');
const CareerModel = require('./models/Career');
const ContactModel = require('./models/Contact');
const SubjectModel = require('./models/Subject');
const TrainingModel = require('./models/Training');

//Video section
const multer = require('multer');
const VideoModel = require('./models/Video');
//const sanitizeFilename = require('sanitize-filename');

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

//Authentication Section
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password == password) {
          // Send user information in the response
          //req.session.user = user;
          res.json({ status: "Success", user: user });
        } else {
          res.json({ status: "Password is incorrect" });
        }
      } else {
        res.json({ status: "No record exists" });
      }
    })
    .catch(error => {
      console.error('MongoDB Query Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  UserModel.create({ name, email, password })
    .then((user) => {
      console.log('User registered:', user);
      res.json({ message: 'Registration successful' });
    })
    .catch((err) => {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/career', (req, res) => {
  const { name, email, jobrole ,location, contact } = req.body;

  CareerModel.create({ name, email, jobrole, location ,contact })
    .then((career) => {
      console.log('Registration Successful we will contact you shortly', career);
      res.json({ message: 'Registration successful' });
    })
    .catch((err) => {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/cttfm', (req, res) => {
  const { fname, lname, email, location, contact,requirement } = req.body;
  ContactModel.create({ fname, lname ,email, location ,contact ,requirement})
    .then((contactform) => {
      console.log('we will contact you shortly', contactform);
      res.json({ message: 'Registration successful' });
    })
    .catch((err) => {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/subjectfm', (req, res) => {
  SubjectModel.create({ fname, lname ,email,subject ,contact})
    .then((contactform) => {
      console.log('we will contact you shortly', contactform);
      res.json({ message: 'Subject registration successful' });
    })
    .catch((err) => {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/trainingfm', (req, res) => {
  TrainingModel.create({ fname, lname ,email,project,duration,contact})
    .then((contactform) => {
      console.log('we will contact you shortly', contactform);
      res.json({ message: 'Training registration successful' });
    })
    .catch((err) => {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// const server = http.createServer((req,res) =>{
//   res.writeHead(200,{"Content-Type": "text/plain"});
//   res.end("Hello world!");
// });

app.listen(PORT,() => console.log("Server is running on port 3000"));