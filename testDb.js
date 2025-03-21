const sequelize = require('./config/database');
const User = require('./models/User');

async function testUsers() {
  try {
    const users = await User.findAll();
    console.log('Users:', users);
  } catch (error) {
    console.error('Error:', error);
  }
}

testUsers();
