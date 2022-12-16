'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: 'The Thing We Do As A Group',
        description: 'almost the same as the other one, but a little different, but mostly same',
        type: 'In person',
        capacity: 10,
        price: 19.50,
        startDate: '2023-10-10 20:00:00',
        endDate: '2023-10-10 22:00:00',
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Gathering For Fun',
        description: 'almost the same as the other one, but a little different, but mostly same',
        type: 'Online',
        capacity: 10,
        price: 19.50,
        startDate: '2023-10-10 20:00:00',
        endDate: '2023-10-10 22:00:00',
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Here We Go Again',
        description: 'almost the same as the other one, but a little different, but mostly same',
        type: 'In person',
        capacity: 10,
        price: 19.50,
        startDate: '2023-10-10 20:00:00',
        endDate: '2023-10-10 22:00:00',
      },
      {
        venueId: 4,
        groupId: 4,
        name: 'The Thing We Do As A Group',
        description: 'almost the same as the other one, but a little different, but mostly same',
        type: 'In person',
        capacity: 10,
        price: 19.50,
        startDate: '2023-10-10 20:00:00',
        endDate: '2023-10-10 22:00:00',
      },
      {
        venueId: 5,
        groupId: 5,
        name: 'Gathering For Fun',
        description: 'almost the same as the other one, but a little different, but mostly same',
        type: 'Online',
        capacity: 10,
        price: 19.50,
        startDate: '2023-10-10 20:00:00',
        endDate: '2023-10-10 22:00:00',
      },
      {
        venueId: 6,
        groupId: 6,
        name: 'Here We Go Again',
        description: 'almost the same as the other one, but a little different, but mostly same',
        type: 'In person',
        capacity: 10,
        price: 19.50,
        startDate: '2023-10-10 20:00:00',
        endDate: '2023-10-10 22:00:00',
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5 , 6] }
    }, {});
  }
};
