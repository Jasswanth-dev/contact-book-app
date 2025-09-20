const express = require('express');
const {path} = require('path');
const sqlite3 = require('sqlite3').verbose();
const cross = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cross());
app.use(express.json());


const dbSource = "contacts.db";

const db = new sqlite3.Database(dbSource, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
        console.log('Connecting to the SQLite database.');
        const sql = `
                CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT, 
                email TEXT UNIQUE, 
                phone TEXT  UnIQUE
            )`;
        db.run(sql, (err) => {
            if (err) {
                console.error('Error creating users table', err.message);
            } else {
                console.log('Connection Successfully With Database');
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (request, response) => {
    response.send('Server is running successfully');
});

