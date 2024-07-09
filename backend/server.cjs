/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { ObjectId } = require('mongoose').Types;
const helmet = require('helmet'); // Add Helmet for security headers
const rateLimit = require('express-rate-limit'); // Add rate limiting
const morgan = require('morgan'); // Add request logging
const xss = require('xss'); // Add XSS protection
const session = require('express-session'); // Add session management (if needed)
const { exec } = require('child_process');

require('dotenv').config();

const app = express();
const allowedOrigins = [
  'https://sanjay-patidar.vercel.app',
  'http://localhost:5173',
  // Add more domains if needed
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Implement rate limiting (100 requests per hour)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Set security headers with Helmet
app.use(helmet());

// Log requests
app.use(morgan('combined'));

// Enable XSS protection
app.use((req, res, next) => {
  req.body = sanitizeRequestBody(req.body);
  next();
});

// Implement session management (if needed)
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true } // Enable secure cookies if using HTTPS
// }));

const port = process.env.PORT || 5000;
const mongoURIMyDB = process.env.MONGODB_URI_MYDB;

mongoose
  .connect(mongoURIMyDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB (mydb)');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB (mydb):', error);
  });

  const Feedback = mongoose.model('feedback', {
    name: String,
    email: String,
    feedback: String,
  });
  const Query = mongoose.model('query', { name: String, email: String, query: String });
  const Certification = mongoose.model('certification', { title: String, imageUrl: [String] });
  const Project = mongoose.model('project', {
    category: String,
    title: String,
    description: [String],
    additionalDetails: [String],
    // Add more fields as needed
  });
  
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  // Directly specify the ChromeDriver path
const chromeDriverPath = '/usr/local/bin/chromedriver';

app.get('/run-script', (req, res) => {
    const command = `CHROME_DRIVER_PATH=${chromeDriverPath} python3 main.py`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Error executing script');
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send('Error in script');
        }
        console.log(`Stdout: ${stdout}`);
        res.send('Script executed successfully');
    });
});
  app.get('/api/certifications', async (req, res) => {
    try {
      const certifications = await Certification.find();
      res.json(certifications);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      res.status(500).json({ error: 'Error fetching certifications' });
    }
  });
  
  app.get('/api/certifications/:title', async (req, res) => {
    try {
      const title = req.params.title;
      // Query your MongoDB collection to find the certification by title
      const certification = await Certification.findOne({ title });
      if (!certification) {
        return res.status(404).json({ error: 'Certification not found' });
      }
      // Return the certification details as JSON
      res.json(certification);
    } catch (error) {
      console.error('Error fetching certification details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/api/projects/category/:category', async (req, res) => {
    try {
      const category = req.params.category;
      if (category === 'all') {
        const projects = await Project.find();
        res.json(projects);
      } else {
        const projects = await Project.find({ category });
        res.json(projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Error fetching projects' });
    }
  });
  
  app.get('/api/projects/details/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      console.log('Received request for project with ID:', id); // Log the ID received
  
      // Check if the ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid project ID:', id); // Log invalid ID
        return res.status(400).json({ error: 'Invalid project ID' });
      }
  
      // Use findById to query the project by its ObjectId
      const project = await Project.findById(id);
  
      console.log('Project data retrieved:', project); // Log the project data retrieved
  
      if (!project) {
        console.log('Project not found'); // Log if project not found
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.json(project);
    } catch (error) {
      console.error('Error fetching project details:', error);
      res.status(500).json({ error: 'Error fetching project details' });
    }
  });
  
  
  
  
  
  
  
  
  app.post('/api/submit-feedback', async (req, res) => {
    try {
      const { name, email, feedback } = req.body;
      const newFeedback = new Feedback({ name, email, feedback });
      await newFeedback.save();
      res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error submitting feedback' });
    }
  });
  
  app.post('/api/submit-query', async (req, res) => {
    try {
      const { name, email, query } = req.body;
      const newQuery = new Query({ name, email, query });
      await newQuery.save();
      res.status(201).json({ message: 'Query submitted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error submitting query' });
    }
  });
  
  const blogsRouter = require('./blogs');
  app.use(blogsRouter);
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.get('/', (req, res) => {
  res.send('Welcome to My API');
});

app.listen(port, () => {
  console.log(`Server is running on :${port}`);
});

// Helper function to sanitize request body against XSS attacks
function sanitizeRequestBody(body) {
  const sanitizedBody = {};
  for (const key in body) {
    if (body.hasOwnProperty(key)) {
      sanitizedBody[key] = xss(body[key]);
    }
  }
  return sanitizedBody;
}
