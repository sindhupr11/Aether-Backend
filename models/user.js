//backend/models/user.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class User extends Model {}
  
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User'
  });

  return User;
};
