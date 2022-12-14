'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        userId: 1,
        status: 'attending'
      },
      {
        eventId: 2,
        userId: 2,
        status: 'waitlist'
      },
      {
        eventId: 3,
        userId: 3,
        status: 'pending'
      },
      {
        eventId: 4,
        userId: 4,
        status: 'attending'
      },
      {
        eventId: 5,
        userId: 5,
        status: 'waitlist'
      },
      {
        eventId: 6,
        userId: 6,
        status: 'pending'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
