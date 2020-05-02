// ./src/database/mongo.js
require('dotenv').config();
const {MongoClient} = require('mongodb');

let database = null;

async function startDatabase() {
  const mongoDBURL = process.env.DB_CONN;
  await MongoClient.connect(mongoDBURL, {useNewUrlParser: true})
    .then(client => {
      console.log('Connected to Database');
      database = client.db('match-organiser-dev');
    })
    .catch(error => console.log(error));
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};