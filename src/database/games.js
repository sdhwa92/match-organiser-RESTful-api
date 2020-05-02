// ./src/database/games.js
const {getDatabase} = require('./mongo');
const {ObjectID} = require('mongodb');

const collectionName = 'gaems';

async function insertGame(game) {
  const database = await getDatabase();
  const {insertedId} = await database.collection(collectionName).insertOne(game);
  return insertedId;
}

async function getGames() {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
}

async function deleteGame(id) {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: new ObjectID(id),
  });
}

async function updateGame(id, game) {
  const database = await getDatabase();
  delete game._id;
  await database.collection(collectionName).update(
    { _id: new ObjectID(id), },
    {
      $set: {
        ...game,
      },
    },
  );
}

module.exports = {
  insertGame,
  getGames,
  deleteGame,
  updateGame,
};

/**
 ObjectID: to be able to tell the database which specific element you want to update or delete.
 $set property: You can inform only the properties that have changed and omit whatever remains the same.
 */