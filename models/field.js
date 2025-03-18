//backend/models/field.js
module.exports = (sequelize, DataTypes) => {
    const Field = sequelize.define('Field', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      label: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false }, // e.g., 'text', 'number', 'date'
      required: { type: DataTypes.BOOLEAN, defaultValue: false },
      form_id: { type: DataTypes.UUID, allowNull: false },
    });
    return Field;
  };
  