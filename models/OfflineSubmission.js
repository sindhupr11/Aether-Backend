const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OfflineSubmission extends Model {}
  
  OfflineSubmission.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    form_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Forms',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    synced: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    synced_at: {
      type: DataTypes.DATE
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'OfflineSubmission',
    tableName: 'offline_submissions',
    underscored: true,
    indexes: [
      {
        fields: ['synced'],
        name: 'offline_submissions_synced_idx'
      }
    ]
  });

  return OfflineSubmission;
}; 