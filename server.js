// server.js — entry point
// Flow: request → routes → controllers → models → MySQL

// Load the .env file first so the settings are ready.
require('dotenv').config();

const express = require('express');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Teach the app to read JSON bodies, like { "title": "Learn Express" }.
app.use(express.json());

// Serve frontend files from the public folder.
app.use(express.static('public'));

// The home page.
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Anything that starts with /tasks goes to the task routes.
app.use('/tasks', taskRoutes);

// Error handler. The four arguments are what make it an error handler.
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start listening.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('GET    /');
  console.log('GET    /tasks');
  console.log('POST   /tasks');
  console.log('GET    /tasks/:id');
  console.log('PUT    /tasks/:id');
  console.log('PATCH  /tasks/:id');
  console.log('DELETE /tasks/:id');
});