
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fs = require('fs');
const https = require('https');
const db = require('./db');
const { timeStamp } = require("console");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allowed origins for dynamic CORS configuration
const allowedOrigins = ['https://chickenegghunt.site', 'https://localhost:9001'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Apply CORS configuration
app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/users', async (req, res) => {
  const users = await db.select().from('users');
  res.json(users);
});

app.get('/username-check', async (req, res) => {
  const username = req.query.username;
  const user = await db('users').where({ name: username }).first();
  res.json({ available: !user });
});

app.post('/users', async (req, res) => {
  const user = await db('users').insert({ name: req.body.name }).returning('*');
  res.json(user);
});

//update version


//lets have a view by user
app.get('/view-user-data/:userId', async (req, res)=>{
  const userId = req.params.userId;
  
    const userData = await db('user_data').where({user_id:userId}).first();
    if(userData){
      res.json({success: true, userData})

    }
    else{
      res.status(404).json({success: false, message: 'user data not availble'})
    }
 
  });

//view all data
app.get('/view-user-data', async(req,res)=>{
 
    const allUserData = await db('user_data').select('*');
    res.json({successs:true, allUserData})

 
});

app.post('/update-user-data', async (req, res) => { try
   {
     const { userId, deathCount, playCount, eggsCollected, sessionDuration, damageTaken, openedInventory, inventory, win } = req.body;
     console.log(req.body); 
     const cleanedInventory = { collectables: { eggs: { brown: inventory?.collectables?.eggs?.brown || 0,
       white: inventory?.collectables?.eggs?.white || 0, 
       golden: inventory?.collectables?.eggs?.golden || 0,
        saphire: inventory?.collectables?.eggs?.saphire || 0 }, 
        posters: { chickenRecipe: inventory?.collectables?.posters?.chickenRecipe || 0, 
          chickenMeme: inventory?.collectables?.posters?.chickenMeme || 0 }, 
          keys: { iron: inventory?.collectables?.keys?.iron || 0,
             golden: inventory?.collectables?.keys?.golden || 0 } },
              equippable: { valve: inventory?.equippable?.valve || false,
                 hats: inventory?.equippable?.hats || '' } }; 
      
                 const user = await db('user_data').where({ user_id: userId }).first();
                 console.log(user);
                  if (user) {
                    const updatedTotalEggs = user.total_eggs + eggsCollected;

                    
                    await db('user_data') .where({ user_id: userId }) .update({ 
                    total_deaths: user.total_deaths + deathCount, 
                    total_eggs: updatedTotalEggs, 
                    total_plays: user.total_plays + playCount, 
                    total_session_duration: user.total_session_duration + sessionDuration,
                     damage_taken: user.damage_taken + damageTaken,
                      opened_inventory: user.opened_inventory + openedInventory, 
                      inventory: JSON.stringify(cleanedInventory),
                      win: user.win +win }); } 
                 else { await db('user_data').insert({
                   user_id: userId, 
                   total_deaths: deathCount,
                    total_eggs: eggsCollected,
                     total_plays: playCount,
                      total_session_duration: sessionDuration, 
                      damage_taken: damageTaken,
                       opened_inventory: openedInventory,
                        inventory: JSON.stringify(cleanedInventory),
                        win: win }); 
                      } res.json({ success: true }); } 
                      catch (error) { 
                        console.error('Error updating user data:', error); 
                        res.status(500).json({ success: false, error: 'Internal Server Error' });
                       } });

//user position
app.post('/user-position', async (req, res) => {
  try{ 
    console.log('Request body:', req.body);
  await db('user_position').insert({
    user_id: req.body.user_name,
    timestamp: req.body.timeStamp,
    x: req.body.x,
    y: req.body.y
  });
  res.status(201).send({message: 'User position saved'})
  } 
  catch (error){
  res.status(500).send({message: 'Failed to save data'});
  }
});

app.get('/user-position/:userId', async (req, res)=>{
  const userId = req.params.userId;
  
  const userData = await db('user_position').where({user_id:userId});
    if(userData){
      res.json({success: true, userData})

    }
    else{
      res.status(404).json({success: false, message: 'user data not availble'})
    }
 


});

app.get('/user-position', async (req, res)=>{
  
  const allUserData = await db('user_position').select('*');
  res.json({successs:true, allUserData})

 
});





// Read SSL files with logging
const sslKeyPath = process.env.SSL_KEY;
const sslCertPath = process.env.SSL_CERT;

console.log(`Reading SSL key from: ${sslKeyPath}`);
console.log(`Reading SSL certificate from: ${sslCertPath}`);

const sslOptions = {
  key: fs.readFileSync(sslKeyPath, 'utf8'),
  cert: fs.readFileSync(sslCertPath, 'utf8')
};

console.log('SSL key and certificate loaded. Starting HTTPS server...');

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running at PORT:${PORT}`);
});
