const InventoryMapper = require('../mappers/InventoryMapper');
const inventoryMapper = InventoryMapper.getInstance();
const Book = require('../business_objects/Book').Book;

exports.getBooks = async function (req, res) {

        inventoryMapper.addBook(new Book('Book 1'));
        inventoryMapper.addBook(new Book('Book 2'));
        inventoryMapper.addBook(new Book('Book 3'));
        inventoryMapper.getBooks()
                .then((books) => {
                        res.status(200);
                        res.json(books);
                }).catch((exception) => {
                        console.log(exception);
                });
}