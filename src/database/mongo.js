// ./src/database/mongo.js
const {MongoClient} = require('mongodb');
require('dotenv').config();

let database = null;

async function startDatabase() {
  const mongoDBURL = process.env.DB_CON_STRING;
  const connection = await MongoClient.connect(mongoDBURL, {useNewUrlParser: true});
  database = connection.db();
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};