const InventoryMapper = require('../mappers/InventoryMapper');
const inventoryMapper = InventoryMapper.getInstance();
const Book = require('../business_objects/Book').Book;

exports.getBooks = async function (req, res) {
    var result = inventoryMapper.getBooks()
            res.status(200);
            res.json(result);
}

exports.addBook = async function (req, res) {
    var result = inventoryMapper.getBooks(book => {
        return book.isbn10 === req.body.isbn10;
    })
    if (result.length === 0) {
        inventoryMapper.addBook(req.body)
            .then((book) => {
                res.status(200);
                res.json(book);
            });
    }
    else {
        console.log("already added book");
        res.status(400);
        res.send();
    }
}