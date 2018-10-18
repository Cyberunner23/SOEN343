const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const CatalogueController = require('./backend/controllers/CatalogueController');
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

app.get('/api/catalogue/getBooks', CatalogueController.getBooks);
app.get('/api/catalogue/getMagazines', CatalogueController.getMagazines);
app.get('/api/catalogue/getMovies', CatalogueController.getMovies);
app.get('/api/catalogue/getMusics', CatalogueController.getMusics);
app.post('/api/catalogue/addBook', CatalogueController.addBook);
app.post('/api/catalogue/addMagazine', CatalogueController.addMagazine);
app.post('/api/catalogue/addMovie', CatalogueController.addMovie);
app.post('/api/catalogue/addMusic', CatalogueController.addMusic);
app.post('/api/catalogue/removeBooks', CatalogueController.removeBooks);
app.post('/api/catalogue/removeMagazines', CatalogueController.removeMagazines);
app.post('/api/catalogue/removeMovies', CatalogueController.removeMovies);
app.post('/api/catalogue/removeMusics', CatalogueController.removeMusics);
