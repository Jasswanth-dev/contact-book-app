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
    console.log(`Server is running on port:${PORT}`);
});

app.get('/', (request, response) => {
    response.send('Server is running successfully');
});

app.get('/api/contacts', (request, response) => {
    const sql = "SELECT * FROM contacts ORDER BY name ASC";  
    db.all(sql, (err, rows) => {
        if (err) {
            response.status(400).json({"error": err.message});
            return;
        }
        response.json({
            "message": "success",
            "data": rows
        });
    });
});

app.post('/api/contacts', (request, response) => {
    const {name, email, phone} = request.body;

    if (!name || !email || (!phone && phone.length === 10)) {
        response.status(400).json({"error_message": "Please provide valid Details"});
        return;
    };

    const checkData = 'SELECT * FROM contacts WHERE email = ? OR phone = ?';
    db.get(checkData, [email, phone], (err, row) => {
        if (err) {
            response.status(400).json({"error": err.message});
            return;
        }
        if (row) {
            response.status(400).json({"error_message": `Email or Phone Alredy Exists`});
            return;
        }else{
            const sql = 'INSERT INTO contacts (name, email, phone) VALUES (?,?,?)'; 
            const params = [name, email, phone];
            db.run(sql, params, (err) => {
                if (err) {
                    response.status(400).json({"error": err.message});
                    return;
                }
                response.json({
                    "message": "success",
                    "data": {id: this.lastID, name, email, phone}
                });
            });
        }
    });
});

app.delete('/api/contacts/:id', (request, response) => {    
    const {id} = request.params;
    const sql = 'DELETE FROM contacts WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) {
            response.status(400).json({"error": err.message});
            return;
        }
        response.json({"message":"Contact deleted"});
    });
});