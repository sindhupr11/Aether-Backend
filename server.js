require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const formRoutes = require('./routes/formRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const db = require('./models');
const jwt = require('jsonwebtoken');

db.sequelize.sync({ alter: true }) // Change to { force: true } if you want to reset DB
  .then(() => console.log("Database connected and synced with Neon!"))
  .catch(err => console.error("Database connection error:", err));

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Server running on port ${PORT}`);
});
