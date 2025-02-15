//creates a user table
const db = require('../db');
(async () => {
  try {
    console.log('start script');
    await db.schema.raw('DROP TABLE IF EXISTS user_position CASCADE'); 
    await db.schema.raw('DROP TABLE IF EXISTS user_data CASCADE'); 
    await db.schema.raw('DROP TABLE IF EXISTS users CASCADE');


    console.log('Creating users table...');
    await db.schema.withSchema('public').createTable('users', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    
    console.log('Creating user_position table...');
    await db.schema.withSchema('public').createTable('user_data', (table)=>
      {
        table.increments('id').primary(); 
        table.string('user_id').notNullable();
        table.integer('total_deaths').defaultTo(0);
        table.integer('total_eggs').defaultTo(0);
        table.integer('total_plays').defaultTo(0);
        table.float('total_session_duration').defaultTo(0.0);
        table.integer('damage_taken').defaultTo(0); 
        table.integer('opened_inventory').defaultTo(0); 
        table.json('inventory'); 
        table.integer('win').defaultTo(0);
        table.timestamp('updated_at').defaultTo(db.fn.now());

      });
       console.log('Creating user_position table...');
      await db.schema.withSchema('public').createTable('user_position', (table)=>
      {
        table.increments('id').primary();
        table.string('user_id').notNullable();
        table.timestamp('timestamp').defaultTo(db.fn.now());
        table.float('x').defaultTo(0.0);
        table.float('y').defaultTo(0.0);
      
      });

    process.exit(0);
    }catch(err){
      process.exit(1)
    }
  })();


//to create more tables just repeat the strucutre then define the values of the table, basically a repeat of what youve just done.