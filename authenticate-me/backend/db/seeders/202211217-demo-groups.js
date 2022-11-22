'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Having Fun in the Sun',
        about: 'We are all about getting together and having fun under the warm sun',
        type: 'In person',
        private: false,
        city: 'Long Beach',
        state: 'CA',
      },
      {
        organizerId: 2,
        name: 'Having Fun in the Sun1',
        about: 'We are all about getting together and having fun under the warm sun',
        type: 'In person',
        private: true,
        city: 'Long Beach',
        state: 'CA',
      },
      {
        organizerId: 3,
        name: 'Having Fun in the Sun2',
        about: 'We are all about getting together and having fun under the warm sun',
        type: 'In person',
        private: false,
        city: 'Long Beach',
        state: 'CA',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      organizerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
