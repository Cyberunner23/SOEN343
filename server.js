const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const UserController = require('./backend/controllers/UserController').getInstance();
const CatalogueCronJobController = require('./backend/controllers/CatalogueCronJobController').getInstance(); // get instance starts cron controller
const bookController = require('./backend/controllers/BookController').getInstance();
const magazineController = require('./backend/controllers/MagazineController').getInstance();
const musicController = require('./backend/controllers/MusicController').getInstance();
const movieController = require('./backend/controllers/MovieController').getInstance();
const transactionController = require('./backend/controllers/TransactionController').getInstance();
const cartItemController = require('./backend/controllers/CartItemController').getInstance();

const port = 5000;

app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

app.post('/api/users/registerUser', UserController.registerUser);
app.post('/api/users/activeUsers', UserController.activeUsers);
app.post('/api/users/login', UserController.authenticate);
app.post('/api/users/logout', UserController.logout);

app.get('/api/catalogue/getBooks', bookController.get);
app.post('/api/catalogue/addBook', bookController.add);
app.post('/api/catalogue/modifyBook', bookController.modify);
app.post('/api/catalogue/removeBooks', bookController.delete);

app.get('/api/catalogue/getMagazines', magazineController.get);
app.post('/api/catalogue/addMagazine', magazineController.add);
app.post('/api/catalogue/modifyMagazine', magazineController.modify);
app.post('/api/catalogue/removeMagazines', magazineController.delete);

app.get('/api/catalogue/getMusics', musicController.get);
app.post('/api/catalogue/addMusic', musicController.add);
app.post('/api/catalogue/modifyMusic', musicController.modify);
app.post('/api/catalogue/removeMusics', musicController.delete);

app.get('/api/catalogue/getMovies', movieController.get);
app.post('/api/catalogue/addMovie', movieController.add);
app.post('/api/catalogue/modifyMovie', movieController.modify);
app.post('/api/catalogue/removeMovies', movieController.delete);

app.post('/api/transaction/getTransactions', transactionController.getTransactions);
app.post('/api/transaction/borrowRecord', transactionController.borrowRecord);
app.post('/api/transaction/returnRecord', transactionController.returnRecord);

app.post('/api/cartItem/getCartItems', cartItemController.getCartItems);
app.post('/api/cartItem/addToCart', cartItemController.addToCart);
app.post('/api/cartItem/removeFromCart', cartItemController.removeFromCart);