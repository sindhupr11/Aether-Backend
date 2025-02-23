const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Project = require('./project')(sequelize, Sequelize);
db.Form = require('./form')(sequelize, Sequelize);
db.Field = require('./field')(sequelize, Sequelize);
db.Submission = require('./submission')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Project, { foreignKey: 'user_id' });
db.Project.belongsTo(db.User, { foreignKey: 'user_id' });

db.Project.hasMany(db.Form, { foreignKey: 'project_id' });
db.Form.belongsTo(db.Project, { foreignKey: 'project_id' });

db.Form.hasMany(db.Field, { foreignKey: 'form_id' });
db.Field.belongsTo(db.Form, { foreignKey: 'form_id' });

db.Form.hasMany(db.Submission, { foreignKey: 'form_id' });
db.Submission.belongsTo(db.Form, { foreignKey: 'form_id' });

module.exports = db;
