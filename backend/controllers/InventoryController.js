const InventoryMapper = require('../mappers/InventoryMapper');
const inventoryMapper = InventoryMapper.getInstance();

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

exports.removeBook = async function (req, res) {
    inventoryMapper.removeBook(book => {
        console.log("1: " + book.isbn10);
        console.log("2: " + req.body);
        return book.isbn10 === req.body.isbn10;
    })
    .then(books => {
        res.status(200);
        res.send();
    });
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

exports.removeMagazine = async function (req, res) {
    inventoryMapper.removeMagazine(magazine => {
        return magazine.isbn10 === req.body.isbn10;
    })
    .then(magazines => {
        res.status(200);
        res.send();
    });
}

exports.getMovies = async function (req, res) {
    var result = inventoryMapper.getMovies()
            res.status(200);
            res.json(result);
}

exports.addMovie = async function (req, res) {
    var result = inventoryMapper.getMovies(movie => {
        return movie.title === req.body.title;
    })
    if (result.length === 0) {
        inventoryMapper.addMovie(req.body)
            .then((movie) => {
                res.status(200);
                res.json(movie);
            });
    }
    else {
        console.log("already added movie");
        res.status(400);
        res.send();
    }
}

exports.removeMovie = async function (req, res) {
    inventoryMapper.removeMovie(movie => {
        return movie.title === req.body.title;
    })
    .then(movies => {
        res.status(200);
        res.send();
    });
}

exports.getMusics = async function (req, res) {
    var result = inventoryMapper.getMusics()
            res.status(200);
            res.json(result);
}

exports.addMusic = async function (req, res) {
    var result = inventoryMapper.getMusics(music => {
        return music.asin === req.body.asin;
    })
    if (result.length === 0) {
        inventoryMapper.addMusic(req.body)
            .then((music) => {
                res.status(200);
                res.json(music);
            });
    }
    else {
        console.log("already added music");
        res.status(400);
        res.send();
    }
}

exports.removeMusic = async function (req, res) {
    inventoryMapper.removeMusic(music => {
        return music.asin === req.body.asin;
    })
    .then(music => {
        res.status(200);
        res.send();
    });
}