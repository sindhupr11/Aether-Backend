//backend/models/submission.js
module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define('Submission', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      form_id: { type: DataTypes.UUID, allowNull: false },
      data: { type: DataTypes.JSONB, allowNull: false }, // JSON object to store submission data
    });
    return Submission;
  };
  