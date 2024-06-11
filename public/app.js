document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  app.innerHTML = '<h1>Welcome to the Social Network</h1>';

  const socket = io();

  socket.on('connect', () => {
    console.log('connected to server');
  });
});
