//backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const formRoutes = require('./routes/formRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const authMiddleware = require('./middleware/auth');
const fieldRoutes = require('./routes/fieldRoutes');
const db = require('./models');

db.sequelize.sync({ alter: true }) // Change to { force: true } if you want to reset DB
  .then(() => console.log("Database connected and synced with Neon!"))
  .catch(err => console.error("Database connection error:", err));

const app = express();

// Enable CORS for frontend requests
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/forms', authMiddleware, formRoutes);
app.use('/api/submissions', authMiddleware, submissionRoutes);
app.use('/api/fields', authMiddleware, fieldRoutes);

app.use('/auth', authRoutes);

// Add this near your other routes to test if the server is responding
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use('/api', formRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Server running on port ${PORT}`);
});
