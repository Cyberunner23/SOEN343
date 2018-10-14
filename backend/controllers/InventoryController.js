const CatalogueMapper = require('../mappers/CatalogueMapper');
const catalogueMapper = CatalogueMapper.getInstance();

exports.getBooks = async function (req, res) {
    var result = catalogueMapper.getBooks()
            res.status(200);
            res.json(result);
}

exports.addBook = async function (req, res) {
    var result = catalogueMapper.getBooks(book => {
        return book.isbn10 === req.body.isbn10;
    })
    if (result.length === 0) {
        catalogueMapper.addBook(req.body)
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

exports.removeBooks = async function (req, res) {
    catalogueMapper.removeBooks(book => {
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
    var result = catalogueMapper.getMagazines()
            res.status(200);
            res.json(result);
}

exports.addMagazine = async function (req, res) {
    var result = catalogueMapper.getMagazines(magazine => {
        return magazine.isbn10 === req.body.isbn10;
    })
    if (result.length === 0) {
        catalogueMapper.addMagazine(req.body)
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

exports.removeMagazines = async function (req, res) {
    catalogueMapper.removeMagazines(magazine => {
        return magazine.isbn10 === req.body.isbn10;
    })
    .then(magazines => {
        res.status(200);
        res.send();
    });
}

exports.getMovies = async function (req, res) {
    var result = catalogueMapper.getMovies()
            res.status(200);
            res.json(result);
}

exports.addMovie = async function (req, res) {
    var result = catalogueMapper.getMovies(movie => {
        return movie.title === req.body.title;
    })
    if (result.length === 0) {
        catalogueMapper.addMovie(req.body)
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

exports.removeMovies = async function (req, res) {
    catalogueMapper.removeMovies(movie => {
        return movie.title === req.body.title;
    })
    .then(movies => {
        res.status(200);
        res.send();
    });
}

exports.getMusics = async function (req, res) {
    var result = catalogueMapper.getMusics()
            res.status(200);
            res.json(result);
}

exports.addMusic = async function (req, res) {
    var result = catalogueMapper.getMusics(music => {
        return music.asin === req.body.asin;
    })
    if (result.length === 0) {
        catalogueMapper.addMusic(req.body)
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

exports.removeMusics = async function (req, res) {
    catalogueMapper.removeMusics(music => {
        return music.asin === req.body.asin;
    })
    .then(music => {
        res.status(200);
        res.send();
    });
}