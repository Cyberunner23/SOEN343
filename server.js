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
app.post('/api/users/activeUsers', UserController.activeUsers);
app.post('/api/users/login', UserController.authenticate);
app.post('/api/users/logout', UserController.logout);

app.get('/api/catalogue/getBooks', InventoryController.getBooks);
app.get('/api/catalogue/getMagazines', InventoryController.getMagazines);
app.get('/api/catalogue/getMovies', InventoryController.getMovies);
app.get('/api/catalogue/getMusics', InventoryController.getMusics);
app.post('/api/catalogue/addBook', InventoryController.addBook);
app.post('/api/catalogue/addMagazine', InventoryController.addMagazine);
app.post('/api/catalogue/addMovie', InventoryController.addMovie);
app.post('/api/catalogue/addMusic', InventoryController.addMusic);
app.post('/api/catalogue/removeBook', InventoryController.removeBook);
app.post('/api/catalogue/removeMagazine', InventoryController.removeMagazine);
app.post('/api/catalogue/removeMovie', InventoryController.removeMovie);
app.post('/api/catalogue/removeMusic', InventoryController.removeMusic);
