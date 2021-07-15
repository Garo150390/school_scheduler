require('../lib/db_connect');
const userDAO = require('../src/components/users/private/dao');

const users = [
  {
    name: 'testAdmin',
    password: '123456',
    phone: '+374111111',
    email: 'test@gmail.com',
    role: 'admin',
  },
  {
    name: 'testAdmin2',
    password: '123456',
    phone: '+3741111235',
    email: 'test2@gmail.com',
    role: 'admin',
  },
  {
    name: 'teacher',
    password: '123456',
    phone: '+3741111234',
    email: 'test3@gmail.com',
    role: 'teacher',
  },
];

exports.seed = (knex) => {
  return knex('users')
    .del()
    .then(() => {
      // Inserts seed entries
      return userDAO
        .insert(users);
    })
    .catch((err) => {
      console.log('users seed ERROR', err.message);
      return '';
    });
};
