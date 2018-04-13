const sqlite3 = require('sqlite3').verbose();

//open local database
let db = new sqlite3.Database('./path/to/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chatbot database.');
});

/* */
//db.serialize(() => {
//
//});
/* */

//close connection to the database
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});