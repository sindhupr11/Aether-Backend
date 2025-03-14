//user.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { 
        type: DataTypes.STRING, 
        allowNull: false,
        defaultValue: 'changeme'
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true
      }
    });
    return User;
  };
  