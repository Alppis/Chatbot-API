//Code from ObjectionJS documentation https://vincit.github.io/objection.js
//and ES6 example project https://github.com/Vincit/objection.js/tree/master/examples/express-es6
const Knex = require('knex');
const express = require('express');
const bodyParser = require('body-parser');
const promiseRouter = require('express-promise-router');
const knexConfig = require('./knexfile');
const registerApi = require('./api/controllers/chatbotController');
const { Model } = require('objection');

//Knex initialization
const knex = Knex(knexConfig.development);

//Binding models for keywords, users, responses and statistics to a knex instance
Model.knex(knex);

const router = promiseRouter();
const app = express()
    .use(bodyParser.json())
    .use(router)

//Register API
registerApi(router);

require('./api/routes/chatbotRoutes')(app);

//Listen for incoming requests
const server = app.listen(5000, () => console.log('Chatbot API listening on port 5000'));