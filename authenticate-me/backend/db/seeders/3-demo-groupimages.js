'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: 'https://picsum.photos/170/82',
        preview: true,
      },
      {
        groupId: 2,
        url: 'https://picsum.photos/170/83',
        preview: true,
      },
      {
        groupId: 3,
        url: 'https://picsum.photos/170/84',
        preview: true,
      },
      {
        groupId: 4,
        url: 'https://picsum.photos/170/85',
        preview: true,
      },
      {
        groupId: 5,
        url: 'https://picsum.photos/170/86',
        preview: true,
      },
      {
        groupId: 6,
        url: 'https://picsum.photos/170/87',
        preview: true,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
