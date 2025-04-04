//backend/models/project.js
module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      description: { type: DataTypes.TEXT },
      user_id: { type: DataTypes.UUID, allowNull: false },
    });
    return Project;
  };
  