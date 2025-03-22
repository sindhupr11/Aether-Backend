const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
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
    project_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Form'
  });

  return Form;
};
