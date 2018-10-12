const InventoryMapper = require('../mappers/InventoryMapper');
const inventoryMapper = InventoryMapper.getInstance();

exports.getBooks = async function (req, res) {
    var result = inventoryMapper.getBooks()
            res.status(200);
            res.json(result);
}

exports.removeBook = async function (req, res) {
    inventoryMapper.removeBook(book => {
        console.log(book.isbn10);
        console.log(req.body);
        return book.isbn10 === req.body.isbn10;
    })
    .then(books => {
        res.status(200);
        res.send();
    });
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

exports.getMagazines = async function (req, res) {
    var result = inventoryMapper.getMagazines()
            res.status(200);
            res.json(result);
}

exports.addMagazine = async function (req, res) {
    var result = inventoryMapper.getMagazines(magazine => {
        return magazine.isbn10 === req.body.isbn10;
    })
    if (result.length === 0) {
        inventoryMapper.addMagazine(req.body)
            .then((magazine) => {
                res.status(200);
                res.json(magazine);
            });
    }
    else {
        console.log("already added magazine");
        res.status(400);
        res.send();
    }
}