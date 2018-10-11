//<editor-fold desc="Constants">
const CatalogueMapper = require('../mappers/CatalogueMapper');
const catalogueMapper = CatalogueMapper.getInstance();

const UserController = require('UserController');

const Exceptions = require('../Exceptions').Exceptions;
//</editor-fold>

// TODO: update when frontend is written

exports.viewItems = async function (req, res) {
    
    catalogueMapper.getCatalogue()
            .then((view) => {
                res.status(200);
                res.json(convertToFrontendView(viewItems));
            })
            .catch((exception) => {
                handleException(res, exception);
    });
    
}

exports.search = async function (req, res) {
    
}

//<editor-fold desc="Add/Modify/Delete methods" defaultstate="collapsed">

// TODO: verify that current user is an administrator before  executing any of the methods below

//<editor-fold desc="Addition methods">
exports.addBook = async function (req, res) {
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // isbn is unique so use isbn to check for exiting book
        catalogueMapper.getBooks({isbn13: req.body.isbn13})
        .then((result) => {
            if(result === 0){
                catalogueMapper.addBook(req.body)
                .then((book) => {
                    res.status(200);
                    res.json(convertToFrontendBook(book));
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else {
                console.log('book already in catalogue');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExceptioni(res, ex);
    });
}

exports.addTrack = async function (req, res) {
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // asin is unique so use asin to check for existing track
        catalogueMapper.getTracks({asin: req.body.asin})
        .then((result) => {
            if(result === 0){
                catalogueMapper.addTrack(req.body)
                .then((track) => {
                    res.status(200);
                    res.json(convertToFrontendTrack(track));
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else {
                console.log('track already in catalogue');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExceptioni(res, ex);
    });
}

exports.addMagazine = async function (req, res) {
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // use isbn to check for existing magazine
        catalogueMapper.getMagazines({isbn13: req.body.isbn13})
        .then((result) => {
            if(result === 0){
                catalogueMapper.addMagazine(req.body)
                .then((magazine) => {
                    res.status(200);
                    res.json(convertToFrontendMagazine(magazine));
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else {
                console.log('magazine already in catalogue');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExceptioni(res, ex);
    });
}

exports.addMovie = async function (req, res){
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // use title, director, and release date to check for existing movie
        catalogueMapper.getMovies(
            {title: req.body.title, director: req.body.director, releaseDate: req.body.releaseDate})
        .then((result) => {
            if(result === 0){
                catalogueMapper.addMovie(req.body)
                .then((movie) => {
                    res.status(200);
                    res.json(convertToFrontendMovie(movie));
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else {
                console.log('movie already in catalogue');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExceptioni(res, ex);
    });
}
//</editor-fold>

//<editor-fold desc="Modification methods">
exports.modifyBook = async function (req, res) {
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find book
        catalogueMapper.getBooks({isbn13: req.body.isbn13})
        .then((result) => {
            if(result === 1){
                catalogueMapper.modifyBook(req.body)
                .then((book) => {
                    res.status(200);
                    res.json(convertToFrontendBook(book));
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else if(result === 0) {
                console.log('book does not exist');
                res.status(400);
                res.send();
            } else {
                console.log('found more than one book to modify');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExceptioni(res, ex);
    });
}

exports.modifyTrack = async function (req, res) {
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find track
        catalogueMapper.getTracks({asin: req.body.asin})
        .then((result) => {
            if(result === 1){
                catalogueMapper.modifyTrack(req.body)
                .then((track) => {
                    res.status(200);
                    res.json(convertToFrontendTrack(track));
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else if(result === 0) {
                console.log('track does not exist');
                res.status(400);
                res.send();
            } else {
                console.log('found more than one track to modify');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExceptioni(res, ex);
    });
}

exports.modifyMagazine = async function (req, res) {
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find magazine
        catalogueMapper.getMagazines({isbn13: req.body.isbn13})
        .then((result) => {
            if(result === 1){
                catalogueMapper.modifyMagazine(req.body)
                .then((magazine) => {
                    res.status(200);
                    res.json(convertToFrontendMagazine(magazine));
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else if(result === 0) {
                console.log('magazine does not exist');
                res.status(400);
                res.send();
            } else {
                console.log('found more than one magazine to modify');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExcpetion(ex);
    });
}

exports.modifyMovie = async function (req, res){
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find movie
        catalogueMapper.getMovies(
                {title: req.body.title, director: req.body.director, releaseDate: req.body.releaseDate})
        .then((result) => {
            if(result === 1){
                catalogueMapper.modifyMovie(req.body)
                .then((movie) => {
                    res.status(200);
                    res.json(convertToFrontendMovie(movie));
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else if(result === 0) {
                console.log('mvoie does not exist');
                res.status(400);
                res.send();
            } else {
                console.log('found more than one movie to modify');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExceptioni(res, ex);
    });
}
//</editor-fold>

//<editor-fold desc="Deletion methods">
exports.deleteBook = async function (req, res) {
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find book
        catalogueMapper.getBooks({isbn13: req.body.isbn13})
        .then((result) => {
            if(result === 1){
                catalogueMapper.deleteBook()
                .then(() => {
                    res.status(200);
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else if(result === 0) {
                console.log('book does not exist');
                res.status(400);
                res.send();
            } else {
                console.log('found more than one book to delete');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExceptioni(res, ex);
    });
}

exports.deleteTrack = async function (req, res) {
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find track
        catalogueMapper.getTracks({asin: req.body.asin})
        .then((result) => {
            if(result === 1){
                catalogueMapper.deleteTrack()
                .then(() => {
                    res.status(200);
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else if(result === 0) {
                console.log('track does not exist');
                res.status(400);
                res.send();
            } else {
                console.log('found more than one track to delete');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExceptioni(res, ex);
    });
}

exports.deleteMagazine = async function (req, res) {
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find magazine
        catalogueMapper.getMagazines({isbn13: req.body.isbn13})
        .then((result) => {
            if(result === 1){
                catalogueMapper.deleteMagazine()
                .then(() => {
                    res.status(200);
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else if(result === 0) {
                console.log('magazine does not exist');
                res.status(400);
                res.send();
            } else {
                console.log('found more than one magazine to delete');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExceptioni(res, ex);
    });
}

exports.deleteMovie = async function (req, res){
    UserController.identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find movie
        catalogueMapper.getMovies(
                {title: req.body.title, director: req.body.director, releaseDate: req.body.releaseDate})
        .then((result) => {
            if(result === 1){
                catalogueMapper.deleteMovie()
                .then(() => {
                    res.status(200);
                })
                .catch((ex) => {
                    handleExceptioni(res, ex);
                });
            } else if(result === 0) {
                console.log('mvoie does not exist');
                res.status(400);
                res.send();
            } else {
                console.log('found more than one movie to modify');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleExceptioni(res, ex);
        });
    })
    .catch((ex) => {
        handleExceptioni(res, ex);
    });
}
//</editor-fold>

//</editor-fold>

convertToFrontendView = (viewItems) => {
    viewItems = [];
    viewItems.forEach((item) => {
        viewItems.push(item);
    });
    return viewItems;
}

//<editor-fold desc="Conversion to frontend for single item" defaultstate="collapsed">
convertToFrontendBook = (book) => {
    let title = book.title;
    let author = book.author;
    let format = book.format;
    let pages = book.pages;
    let publisher = book.publisher;
    let datePublished = book.datePublished;
    let language = book.language;
    let isbn10 = book.isbn10;
    let isbn13 = book.isbn13;
    return (
        {title, author, format, pages, publisher, datePublished, language, isbn10, isbn13}
    );
}

convertToFrontendTrack = (track) => {
    let title = track.title;
    let artist = track.artist;
    let label = track.label;
    let type = track.type;
    let releaseDate = track.releaseDate;
    let asin = track.asin;
    return (
        {title, artist, label, type, releaseDate, asin}
    );
}

convertToFrontendMagazine = (magazine) => {
    let title = magazine.title;
    let publisher = magazine.publisher;
    let publishDate = magazine.publishDate;
    let language = magazine.language;
    let isbn10 = magazine.isbn10;
    let isbn13 = magazine.isbn13;
    return (
        {title, publisher, publishDate, language, isbn10, isbn13}
    );
}

convertToFrontendMovie = (movie) => {
    let title = movie.title;
    let director = movie.director;
    let producers = movie.producers;
    let actors = movie.actors;
    let language = movie.language;
    let subtitles = movie.subtitles;
    let dubbed = movie.dubbed;
    let releaseDate = movie.releaseDate;
    let runTime = movie.runTime;
    return (
        {title, director, producers, actors, language, subtitles, dubbed, releaseDate, runTime}
    );
}
//</editor-fold>

handleException = function(res, exception) {
    switch(exception){
        case CatalogueMapper.Exceptions.InternalServerError:
        default:
            res.status(500);
            res.send();
    }
}