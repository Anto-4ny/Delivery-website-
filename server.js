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

// Backend Node.js code (server.js)

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