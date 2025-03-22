module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('Field', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      label: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false }, // e.g., 'text', 'number', 'date'
      required: { type: DataTypes.BOOLEAN, defaultValue: false },
      form_id: { type: DataTypes.UUID, allowNull: false },
      primary_key: { type: DataTypes.BOOLEAN, defaultValue: false }, // Only one field can be primary key
      order: { type: DataTypes.INTEGER, allowNull: false }, // Order of appearance in form
  });

  return Field;
};
