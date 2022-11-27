'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.hasMany(
        models.GroupImage,
        { foreignKey: 'groupId' }
      )
      Group.belongsToMany(
        models.User,
        { through: models.Membership }
      )
      Group.belongsTo(
        models.User,
        { foreignKey: 'organizerId' }
      )
      Group.hasMany(
        models.Event,
        { foreignKey: 'groupId' }
      )
      Group.hasMany(
        models.Venue,
        { foreignKey: 'groupId' }
      )
      Group.hasMany(
        models.Membership,
        { foreignKey: 'groupId' }
      )
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 60]
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [50, 255]
      }
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
