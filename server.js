const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const InventoryController = require('./backend/controllers/InventoryController');
const UserController = require('./backend/controllers/UserController').getInstance();

const port = 5000;

app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

app.post('/api/users/registerUser', UserController.registerUser);
app.post('/api/users/login', UserController.authenticate);
app.get('/api/getBooks', InventoryController.getBooks);
app.post('/api/addBook', InventoryController.addBook);
app.get('/api/getMagazines', InventoryController.getMagazines);
app.post('/api/addMagazine', InventoryController.addMagazine);
app.post('/api/users/activeUsers', UserController.activeUsers);
app.post('/api/users/logout', UserController.logout);
