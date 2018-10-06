const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const UserController = require('./backend/controllers/UserController');

const port = 5000;

app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

app.post('/api/users/registerUser', UserController.registerUser);
app.post('/api/users/login', UserController.authenticate);
app.get('/api/activeUsers', UserController.activeUsers);