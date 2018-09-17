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

//Test route to ensure that front-end receives from back-end
app.get('/api/customers', (req, res) => {
    const customers = [
        {id: 1, firstName: 'John', lastName: 'Doe'},
        {id: 2, firstName: 'Mary', lastName: 'Swanson'},
        {id: 3, firstName: 'Steve', lastName: 'Smith'}
    ];
    res.json(customers);
});