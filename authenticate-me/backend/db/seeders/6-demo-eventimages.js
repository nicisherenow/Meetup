'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: 'https://picsum.photos/178/100',
        preview: true,
      },
      {
        eventId: 2,
        url: 'https://picsum.photos/178/102',
        preview: true,
      },
      {
        eventId: 3,
        url: 'https://picsum.photos/178/101',
        preview: true,
      },
      {
        eventId: 4,
        url: 'https://picsum.photos/178/106',
        preview: true,
      },
      {
        eventId: 5,
        url: 'https://picsum.photos/178/105',
        preview: true,
      },
      {
        eventId: 6,
        url: 'https://picsum.photos/178/104',
        preview: true,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
