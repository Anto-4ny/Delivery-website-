const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

mongoose.connect('mongodb://localhost:27017/socialNetwork', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Backend Node.js code (server.js) for Reviews

const express = require('express');
const app = express();
const PORT = 3000;

// Example route to handle GET request from frontend
app.get('/api/data', (req, res) => {
    // Example data to send to the frontend
    const data = { message: 'Hello from the backend!' };
    
    // Send the data as JSON response
    res.json(data);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const reviews = [];

app.use(cors());
app.use(bodyParser.json());

// Endpoint to get reviews
app.get('/api/reviews', (req, res) => {
  res.json(reviews);
});

// Endpoint to add a new review
app.post('/api/reviews', (req, res) => {
  const { name, profilePic, text } = req.body;
  reviews.push({ name, profilePic, text });
  res.status(201).json({ message: 'Review added!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//update reviews 
async function fetchReviews() {
  try {
    const response = await fetch('http://localhost:3000/api/reviews');
    const reviews = await response.json();

    const container = document.querySelector('.reviews-container');
    reviews.forEach(review => {
      const reviewBox = document.createElement('div');
      reviewBox.classList.add('review-box');
      reviewBox.innerHTML = `
        <img src="${review.profilePic}" alt="${review.name}'s profile picture">
        <div class="name">${review.name}</div>
        <div class="review-text">${review.text}</div>
      `;
      container.appendChild(reviewBox);
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
    }

