const db = require('./models');

async function testConnection() {
  try {
    await db.sequelize.authenticate();
    console.log('Connected to Neon DB successfully!');

    const users = await db.User.findAll();
    console.log('Users:', users);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await db.sequelize.close();
  }
}

testConnection();
