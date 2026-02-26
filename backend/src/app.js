const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectMongo = require('./config/mongo');
const assignmentRoutes = require('./routes/assignments');
const executeRoutes = require('./routes/execute');
const hintRoutes = require('./routes/hint');

console.log('assignmentRoutes type:', typeof assignmentRoutes);
console.log('executeRoutes type:', typeof executeRoutes);
console.log('hintRoutes type:', typeof hintRoutes);

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api/hint', hintRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'CipherSQLStudio API running' });
});

const PORT = process.env.PORT || 5000;

connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection failed:', err);
  });