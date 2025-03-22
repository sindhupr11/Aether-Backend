//backend/models/form.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, Sequelize) => {
  class Form extends Model {}
  
  Form.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sections: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Form'
  });

  return Form;
};
  