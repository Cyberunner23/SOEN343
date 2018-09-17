const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 5000;

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'soen343'
});

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('MySql connected...');
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

//Test route to ensure that front-end receives from back-end. All this does now
//is return the clients in the 'clients' table.
app.get('/api/clients', (req, res) => {
    let sql = 'SELECT * FROM clients';
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.json(results);
    });
});
