//backend/config/db.js
const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development']);

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

module.exports = sequelize;
