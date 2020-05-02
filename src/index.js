// ./src/index.js

// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {startDatabase} = require('./database/mongo');
const {insertGame, getGames, deleteGame, updateGame} = require('./database/games');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// defining the Express app
const app = express();

// defining an array to work as the database (temporary solution)
const games = [
  {title: 'Hello, world (again)!'}
];

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all games
app.get('/', async (req, res) => {
  res.send(await getGames());
});

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-qszdkr1m.au.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'https://matchorganiser/',
  issuer: `https://dev-qszdkr1m.au.auth0.com/`,
  algorithm: ['RS256']
});

app.use(checkJwt);

app.post('/', async (req, res) => {
  const newGame = req.body;
  await insertGame(newGame);
  res.send({ message: 'New game inserted.' });
});

/**
 * Using Express route parameters to be able to fetch, from the URL requested.
 * The id of the game you want to delete or update (/:id).
 */
// endpoint to delete an game
app.delete('/:id', async (req, res) => {
  await deleteGame(req.params.id);
  res.send({ message: 'Game removed.' });
});

// endpoint to update an game
app.put('/:id', async (req, res) => {
  const updatedGame = req.body;
  await updateGame(req.params.id, updatedGame);
  res.send({ message: 'Game updated.' });
});

// start the in-memory MongoDB instance
startDatabase().then(async () => {
  // start the server
  app.listen(3001, async () => {
    console.log('listening on port 3001');
  });
});