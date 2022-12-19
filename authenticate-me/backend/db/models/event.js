'use strict';
const {
  Model, ValidationError
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
        len: [10, 2000]
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
      type: DataTypes.NUMERIC(7, 2),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterToday(value) {
          if(Date.parse(value) > Date.now()){
            return true
          } else {
            throw new ValidationError ("Start date must be in the future")
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStart(value) {
          if (Date.parse(value) > Date.parse(this.startDate)) {
            return true
          } else {
            throw new ValidationError ("End date is less than start date")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
