//backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const formRoutes = require('./routes/formRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const fieldRoutes = require('./routes/fieldRoutes');
const db = require('./models');
const llmRoutes = require('./routes/llmRoutes');
const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/forms', authMiddleware, formRoutes);
app.use('/api/submissions', authMiddleware, submissionRoutes);
app.use('/api/fields', authMiddleware, fieldRoutes);
app.use('/api/llm', llmRoutes);


const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: true }) 
  .then(() => console.log("Database connected and synced with Neon!"))
  .catch(err => console.error("Database connection error:", err));

  app.listen(PORT, async () => {
    await sequelize.sync();
    console.log(`Server running on port ${PORT}`);
  });

