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

