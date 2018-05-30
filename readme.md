- Prerequisites:
    - NodeJS and npm installed

- Depedencies:
    "devDependencies": {
    "babel": "^6.23.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.4",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "chai": "^4.1.2",
    "concurrently": "^3.5.1",
    "css-loader": "^0.28.11",
    "enzyme": "^3.3.0",
    "mocha": "^5.2.0",
    "node-sass": "^4.9.0",
    "sass-loader": "^7.0.1",
    "style-loader": "^0.21.0",
    "webpack": "^4.8.3",
    "webpack-cli": "^2.1.3",
    "nodemon": "^1.17.3"
  },
  "dependencies": {
    "body-parser": "^1.18.2",
    "express": "^4.16.3",
    "express-promise-router": "^3.0.2",
    "knex": "^0.14.6",
    "objection": "^1.1.5",
    "objection-db-errors": "^1.0.0",
    "react": "^16.3.2",
    "react-dom": "^16.3.2",
    "request": "^2.86.0",
    "sqlite3": "^4.0.0"
  }

    - use 'npm install' in root folder to install required depedencies for API
      AND 'npm install' in chatbot/client folder to install required depedencies for client
    OR
    - install one by one by hand

- Database setup:
    - create database.db from dumps (found from chatbot/db folder) 
    'sqlite3 database.db < keywords_schema_dump.sql' -->      
    'sqlite3 database.db < keywords_data_dump.sql'
    OR
    - use predone located in chatbot/freshdb

    NOTICE: after every test run, database setup has to be done again

- Startting only API
    - use 'npm run server' command to start API

- Startting API & Chatbot client
    - use 'npm run dev' command to start API and Chatbot client

- Running tests
    - start test with 'npm test' command

- Accessing API resources
    - http://localhost:5000/api/{resourcename}