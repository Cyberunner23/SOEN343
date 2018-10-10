const InventoryMapper = require('../mappers/InventoryMapper');
const inventoryMapper = InventoryMapper.getInstance();
const Book = require('../business_objects/Book').Book;

exports.getBooks = async function (req, res) {
    inventoryMapper.getBooks({})
        .then((books) => {
            res.status(200);
            res.json(books);
        }).catch((exception) => {
            console.log(exception);
        });
}

exports.addBook = async function (req, res) {
    inventoryMapper.getBooks({ title: req.body.title })
        .then((result) => {
            if (result.length === 0) {
                inventoryMapper.addBook(req.body.title)
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
        })
        .catch((exception) => {
            console.log(exception);
        })
}