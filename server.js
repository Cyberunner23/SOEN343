const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const CatalogueController = require('./backend/controllers/CatalogueController').getInstance();
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
app.post('/api/catalogue/modifyBook', CatalogueController.modifyBook);
app.post('/api/catalogue/modifyMagazine', CatalogueController.modifyMagazine);
app.post('/api/catalogue/modifyMovie', CatalogueController.modifyMovie);
app.post('/api/catalogue/modifyMusic', CatalogueController.modifyMusic);
app.post('/api/catalogue/removeBooks', CatalogueController.deleteBook);
app.post('/api/catalogue/removeMagazines', CatalogueController.deleteMagazine);
app.post('/api/catalogue/removeMovies', CatalogueController.deleteMovie);
app.post('/api/catalogue/removeMusics', CatalogueController.deleteMusic);
