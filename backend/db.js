const knex = require('knex')
module.exports = knex({
  client: 'postgres',
  connection: {
    host: 'db',
    user: 'testUser',
    password: 'mypassword123',
    database: 'testUser',
    
  },
})