'use strict';
const {
  Model
} = require('sequelize');
const attendance = require('./attendance');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(
        models.EventImage,
        { foreignKey: 'eventId', sourceKey: 'id' }
      )
      Event.belongsToMany(
        models.User,
        {
          through: models.Attendance,
          foreignKey: 'eventId',
          otherKey: 'userId'
        }
      )
      Event.belongsTo(
        models.Venue,
        { foreignKey: 'venueId', targetKey: 'id' }
      )
      Event.belongsTo(
        models.Group,
        { foreignKey: 'groupId', targetKey: 'id' }
      )
      Event.hasMany(
        models.Attendance,
        { foreignKey: 'eventId', sourceKey: 'id' }
      )
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 60]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 255]
      }
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.NUMBER(7, 2),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
