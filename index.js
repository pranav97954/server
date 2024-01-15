const http = require("http");
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");

require("dotenv").config();
const Joi = require('joi');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes')
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

app.use("/",authRoutes);
//Query
const QueryModel = require('./models/Query');
//const UserModel = require('./models/User');
const CareerModel = require('./models/Career');
const ContactModel = require('./models/Contact');
const SubjectModel = require('./models/Subject');
const TrainingModel = require('./models/Training');

//Video section
const multer = require('multer');
const VideoModel = require('./models/Video');

const sanitizeFilename = require('sanitize-filename');
const sessionSecret = process.env.SESSION_SECRET || 'a38ebe1628cf6092be0ba8aa8e1ed286875afd11e1da2dabfc875d6afc4a66c9';

const session = require('express-session');

// Update MongoDB connection URI
//const MONGODB_URI = 'mongodb+srv://pranavkumar97954:zlVxT7INPRW8Sjbi@cluster0.gi6fh6q.mongodb.net/akash?retryWrites=true&w=majority';
const MONGODB_URI = 'mongodb+srv://aakashacad3000:aakashacad3000@cluster0.h58dy0y.mongodb.net/project0?retryWrites=true&w=majority';

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

//Ready to use
app.post('/subjectfm', async (req, res) => {
  try {
    const { fname, lname, email, subject, contact } = req.body;

    // Input validation using Joi
    const schema = Joi.object({
      fname: Joi.string().required(),
      lname: Joi.string().required(),
      email: Joi.string().email().required(),
      subject: Joi.string().required(),
      contact: Joi.string().required(),
    });

    const validationResult = schema.validate({ fname, lname, email, subject, contact });

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const contactform = await SubjectModel.create({ fname, lname, email, subject, contact });

    console.log('we will contact you shortly', contactform);
    res.json({ message: 'Subject registration successful' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/career', async (req, res) => {
  try {
    const { name, email, jobrole, location, contact } = req.body;

    // Input validation using Joi
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      jobrole: Joi.string().required(),
      location: Joi.string().required(),
      contact: Joi.string().required(),
    });

    const validationResult = schema.validate({ name, email, jobrole, location, contact });

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const career = await CareerModel.create({ name, email, jobrole, location, contact });

    console.log('Registration Successful. We will contact you shortly', career);
    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/cttfm', async (req, res) => {
  try {
    const { fname, lname, email, location, contact, requirement } = req.body;

    // Input validation using Joi
    const schema = Joi.object({
      fname: Joi.string().required(),
      lname: Joi.string().required(),
      email: Joi.string().email().required(),
      location: Joi.string().required(),
      contact: Joi.string().required(),
      requirement: Joi.string().required(),
    });

    const validationResult = schema.validate({ fname, lname, email, location, contact, requirement });

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const contactform = await ContactModel.create({ fname, lname, email, location, contact, requirement });

    console.log('Registration Successful. We will contact you shortly', contactform);
    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/trainingfm', (req, res) => {
  const { fname, lname, email, project, duration, contact } = req.body; // Access data from request body

  TrainingModel.create({ fname, lname, email, project, duration, contact })
    .then((trainingForm) => {
      console.log('We will contact you shortly', trainingForm);
      res.json({ message: 'Training registration successful' });
    })
    .catch((err) => {
      console.error('Error creating training registration:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

//Query
app.get('/get-queries', async (req, res) => {
  try {
    const queries = await QueryModel.find().exec();
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this endpoint to post a new query
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


app.get('/adminview', async (req, res) => {
  try {
    const subjects = await SubjectModel.find().exec();
    const careerss = await CareerModel.find().exec();
    const requirementt = await ContactModel.find().exec();
    const trainingg = await TrainingModel.find().exec();

    res.json({ subjects, careerss, requirementt,trainingg });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(
  cors({
   origin: ["http://localhost:5173"],
   method:["GET","POST"],
   credentials:true,
  })
);

const server = http.createServer((req,res) =>{
  res.writeHead(200,{"Content-Type": "text/plain"});
  res.end("Hello world!");
}); 

app.listen(PORT,() => console.log("Server is running on port 3000"));