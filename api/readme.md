- Prerequisites:
    - NodeJS and npm installed

- Depedencies:
    "body-parser": "^1.18.2",
    "express": "^4.16.3",
    "express-promise-router": "^3.0.2",
    "knex": "^0.14.6",
    "mocha": "^5.1.0",
    "objection": "^1.1.5",
    "objection-db-errors": "^1.0.0",
    "request": "^2.86.0",
    "sqlite3": "^4.0.0"

    - use 'npm install' to install required depedencies
    OR
    - install one by one by hand

- Database setup:
    - create database.db from dumps (found from chatbot/db folder) 
    'sqlite3 database.db < keywords_schema_dump.sql' -->      
    'sqlite3 database.db < keywords_data_dump.sql'
    OR
    - use predone located in chatbot/freshdb

- Startting API
    - use 'npm run start' command to start API

- Running tests
    - start test with 'npm test' command

- Accessing API resources
    - http://localhost:5000/api/{resourcename}