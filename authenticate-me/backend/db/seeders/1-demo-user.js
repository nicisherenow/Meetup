'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Sterven',
        lastName: 'Alexandrious',
        email: 'demo@user.io',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Jimbo',
        lastName: 'Slice',
        email: 'user1@user.io',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Carrie',
        lastName: 'Jane',
        email: 'user2@user.io',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Fillup',
        lastName: 'Alexandrious',
        email: 'demo@use1r.io',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Lee',
        lastName: 'Slice',
        email: 'user1@use1r.io',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'James',
        lastName: 'Jane',
        email: 'user2@use1r.io',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      firstName: { [Op.in]: ['Sterven', 'Jimbo', 'Carrie', 'Fillup', 'Lee', 'James'] }
    }, {});
  }
};
