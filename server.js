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

//Error handling
const {
    ValidationError,
    NotFoundError
  } = require('objection');
  
  const {
    DBError,
    ConstraintViolationError,
    UniqueViolationError,
    NotNullViolationError,
    ForeignKeyViolationError,
    CheckViolationError,
    DataError
  } = require('objection-db-errors');
  
  //`res` is an express response object.
  function errorHandler(err, res) {
    if (err instanceof ValidationError) {
      switch (err.type) {
        case 'ModelValidation':
          res.status(400).send({
            message: err.message,
            type: 'ModelValidation',
            data: err.data
          });
          break;
        case 'RelationExpression':
          res.status(400).send({
            message: err.message,
            type: 'InvalidRelationExpression',
            data: {}
          });
          break;
        case 'UnallowedRelation':
          res.status(400).send({
            message: err.message,
            type: 'UnallowedRelation',
            data: {}
          });
          break;
        case 'InvalidGraph':
          res.status(400).send({
            message: err.message,
            type: 'InvalidGraph',
            data: {}
          });
          break;
        default:
          res.status(400).send({
            message: err.message,
            type: 'UnknownValidationError',
            data: {}
          });
          break;
      }
    } else if (err instanceof NotFoundError) {
      res.status(404).send({
        message: err.message,
        type: 'NotFound',
        data: {}
      });
    } else if (err instanceof UniqueViolationError) {
      res.status(409).send({
        message: err.message,
        type: 'UniqueViolation',
        data: {
          columns: err.columns,
          table: err.table,
          constraint: err.constraint
        }
      });
    } else if (err instanceof NotNullViolationError) {
      res.status(400).send({
        message: err.message,
        type: 'NotNullViolation',
        data: {
          column: err.column,
          table: err.table,
        }
      });
    } else if (err instanceof ForeignKeyViolationError) {
      res.status(409).send({
        message: err.message,
        type: 'ForeignKeyViolation',
        data: {
          table: err.table,
          constraint: err.constraint
        }
      });
    } else if (err instanceof CheckViolationError) {
      res.status(400).send({
        message: err.message,
        type: 'CheckViolation',
        data: {
          table: err.table,
          constraint: err.constraint
        }
      });
    } else if (err instanceof DataError) {
      res.status(400).send({
        message: err.message,
        type: 'InvalidData',
        data: {}
      });
    } else if (err instanceof DBError) {
      res.status(500).send({
        message: err.message,
        type: 'UnknownDatabaseError',
        data: {}
      });
    } else {
      res.status(500).send({
        message: err.message,
        type: 'UnknownError',
        data: {}
      });
    }
  }

//Defines simple route
//app.get('/', (req, res) => res.send('Chatbot API v0.0.1'));

require('./api/routes/chatbotRoutes')(app);

//Listen for incoming requests
const server = app.listen(5000, () => console.log('Chatbot API listening on port 5000'));