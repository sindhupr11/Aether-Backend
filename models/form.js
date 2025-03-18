//backend/models/form.js
module.exports = (sequelize, DataTypes) => {
    const Form = sequelize.define('Form', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      project_id: { type: DataTypes.UUID, allowNull: false },
    });
    return Form;
  };
  