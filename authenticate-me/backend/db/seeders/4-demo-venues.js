'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: '1235 Birch Street',
        city: 'Long Beach',
        state: 'CA',
        lat: 75.9194012,
        lng: 100.0101013
      },
      {
        groupId: 2,
        address: '1500 Elm Street',
        city: 'Long Beach',
        state: 'CA',
        lat: 73.9194012,
        lng: 101.0101013
      },
      {
        groupId: 3,
        address: '1235 Oak Street',
        city: 'Long Beach',
        state: 'CA',
        lat: 71.9194012,
        lng: 102.0101013
      },
      {
        groupId: 4,
        address: '1235 Birch Street',
        city: 'Long Beach',
        state: 'CA',
        lat: 75.9194012,
        lng: 100.0101013
      },
      {
        groupId: 5,
        address: '1500 Elm Street',
        city: 'Long Beach',
        state: 'CA',
        lat: 73.9194012,
        lng: 101.0101013
      },
      {
        groupId: 6,
        address: '1235 Oak Street',
        city: 'Long Beach',
        state: 'CA',
        lat: 71.9194012,
        lng: 102.0101013
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
