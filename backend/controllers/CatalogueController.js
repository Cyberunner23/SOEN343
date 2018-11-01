//<editor-fold desc="Constants">
const catalogueMapper = require('../mappers/CatalogueMapper').getInstance();

const identifyUser = require('./UserController').identifyUser;

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
    // determine what type of item search is for
    
    // use item-specific search
    
}

//<editor-fold desc="Add/Modify/Delete methods" defaultstate="collapsed">

//<editor-fold desc="Addition methods">
exports.addBook = async function (req, res) {
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // isbn is unique so use isbn to check for exiting book
        var result = catalogueMapper.getBooks(book => {
            return book.isbn13 === req.body.isbn13;
        })
        if(result.length === 0){
            catalogueMapper.addBook(req.body)
                .then((book) => {
                    res.status(200);
                    res.json(convertToFrontendBook(book));
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else {
            console.log('book already in catalogue');
            res.status(400);
            res.send();
        }
    })
    .catch((ex) => {
        handleException(res, ex);
    });
}

exports.addMusic = async function (req, res) {
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // asin is unique so use asin to check for existing music
        var result = catalogueMapper.getMusics(music => {
            return music.asin === req.body.asin;
        })
        if(result.length === 0){
            catalogueMapper.addMusic(req.body)
                .then((music) => {
                    res.status(200);
                    res.json(convertToFrontendMusic(music));
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else {
            console.log('music already in catalogue');
            res.status(400);
            res.send();
        }
    })
    .catch((ex) => {
        handleException(res, ex);
    });
}

exports.addMagazine = async function (req, res) {
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // use isbn to check for existing magazine
        var result = catalogueMapper.getMagazines(magazine => {
            return magazine.isbn13 === req.body.isbn13;
        })
        if(result.length === 0){
            catalogueMapper.addMagazine(req.body)
                .then((magazine) => {
                    res.status(200);
                    res.json(convertToFrontendMagazine(magazine));
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else {
            console.log('magazine already in catalogue');
            res.status(400);
            res.send();
        }
    })
    .catch((ex) => {
        handleException(res, ex);
    });
}

exports.addMovie = async function (req, res){
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // use title, director, and release date to check for existing movie
        var result = catalogueMapper.getMovies(music => {
            return music.eidr === req.body.eidr;
        })
        if(result.length === 0){
            catalogueMapper.addMovie(req.body)
                .then((movie) => {
                    res.status(200);
                    res.json(convertToFrontendMovie(movie));
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else {
            console.log('movie already in catalogue');
            res.status(400);
            res.send();
        }
    })
    .catch((ex) => {
        handleException(res, ex);
    });
}
//</editor-fold>

//<editor-fold desc="Modification methods">
exports.modifyBook = async function (req, res) {
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find book
        var result = catalogueMapper.getBooks(book => {
            return book.isbn13 === req.body.isbn13;
        })
        if(result.length === 1){
            catalogueMapper.modifyBooks(req.body, book => {
                return book.isbn13 === req.body.isbn13
            })
                .then((books) => {
                    res.status(200);
                    res.json(convertToFrontendBook(books[0]));
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else if(result.length === 0) {
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
        handleException(res, ex);
    });
}

exports.modifyMusic = async function (req, res) {
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find music
        var result = catalogueMapper.getMusics(music => {
            return music.asin === req.body.asin;
        })
        if(result.length === 1){
            catalogueMapper.modifyMusics(req.body, music => {
                return music.asin === req.body.asin;
            })
                .then((musics) => {
                    res.status(200);
                    res.json(convertToFrontendMusic(musics[0]));
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else if(result.length === 0) {
            console.log('music does not exist');
            res.status(400);
            res.send();
        } else {
            console.log('found more than one music to modify');
            res.status(400);
            res.send();
        }
    })
    .catch((ex) => {
        handleException(res, ex);
    });
}

exports.modifyMagazine = async function (req, res) {
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find magazine
        var result = catalogueMapper.getMagazines(magazine => {
            return magazine.isbn13 === req.body.isbn13;
        })
        if(result.length === 1){
            catalogueMapper.modifyMagazines(req.body, magazine => {
                return magazine.isbn13 === req.body.isbn13;
            })
                .then((magazines) => {
                    res.status(200);
                    res.json(convertToFrontendMagazine(magazines[0]));
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else if(result.length === 0) {
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
        handleExcpetion(ex);
    });
}

exports.modifyMovie = async function (req, res){
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find movie
        var result = catalogueMapper.getMovies(movie => {
            return movie.eidr === req.body.eidr;
        })
        if(result.length === 1){
            catalogueMapper.modifyMovies(req.body, movie => {
                return movie.eidr === req.body.eidr;
            })
                .then((movies) => {
                    res.status(200);
                    res.json(convertToFrontendMovie(movies[0]));
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else if(result.length === 0) {
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
        handleException(res, ex);
    });
}
//</editor-fold>

//<editor-fold desc="Deletion methods">
exports.deleteBook = async function (req, res) {
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find book
        var result = catalogueMapper.getBooks(book => {
            return book.isbn13 === req.body.isbn13;
        })
        if(result.length === 1){
            catalogueMapper.removeBooks(book => {
                return book.isbn13 === req.body.isbn13;
            })
                .then(() => {
                    res.status(200);
                    res.send();
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else if(result.length === 0) {
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
        handleException(res, ex);
    });
}

exports.deleteMusic = async function (req, res) {
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find music
        var result = catalogueMapper.getMusics(music => {
            return music.asin === req.body.asin;
        })
        if(result.length === 1){
            catalogueMapper.removeMusics(music => {
                return music.asin === req.body.asin;
            })
                .then(() => {
                    res.status(200);
                    res.send();
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else if(result.length === 0) {
            console.log('music does not exist');
            res.status(400);
            res.send();
        } else {
            console.log('found more than one music to delete');
            res.status(400);
            res.send();
        }
    })
    .catch((ex) => {
        handleException(res, ex);
    });
}

exports.deleteMagazine = async function (req, res) {
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find magazine
        var result = catalogueMapper.getMagazines(magazine => {
            return magazine.isbn13 === req.body.isbn13;
        })
        if(result.length === 1){
            catalogueMapper.removeMagazines(magazine => {
                return magazine.isbn13 === req.body.isbn13;
            })
                .then(() => {
                    res.status(200);
                    res.send();
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else if(result.length === 0) {
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
        handleException(res, ex);
    });
}

exports.deleteMovie = async function (req, res){
    identifyUser(req.body.authToken)
    .then((user) => {
        if(!user.is_admin){
            handleException(res, Exceptions.Unauthorized);
            return;
        }
        // find movie
        var result = catalogueMapper.getMovies(movie => {
            return movie.eidr === req.body.eidr;
        })
        if(result.length === 1){
            catalogueMapper.removeMovies(movie => {
                return movie.eidr === req.body.eidr;
            })
                .then(() => {
                    res.status(200);
                    res.send();
                })
                .catch((ex) => {
                    handleException(res, ex);
                });
        } else if(result.length === 0) {
            console.log('movie does not exist');
            res.status(400);
            res.send();
        } else {
            console.log('found more than one movie to modify');
            res.status(400);
            res.send();
        }
    })
    .catch((ex) => {
        handleException(res, ex);
    });
}
//</editor-fold>

//</editor-fold>

convertToFrontendView = (catalogueItems) => {
    viewItems = [];
    catalogueItems.forEach((item) => {
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

convertToFrontendMusic = (music) => {
    let title = music.title;
    let artist = music.artist;
    let label = music.label;
    let type = music.type;
    let releaseDate = music.releaseDate;
    let asin = music.asin;
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
    let eidr = movie.eidr;
    return (
        {title, director, producers, actors, language, subtitles, dubbed, releaseDate, runTime, eidr}
    );
}
//</editor-fold>

//<editor-fold desc="Get methods" defaultstate="collapsed">
exports.getBooks = async function(req, res) {
    var result = catalogueMapper.getBooks((book) => {genFilter(book, req.body.filters)});
    res.status(200);
    res.json(result);
}

exports.getMusics = async function(req, res) {
    var result= catalogueMapper.getMusics((music) => {genFilter(music, req.body.filters)});
    res.status(200);
    res.json(result);
}

exports.getMagazines = async function(req, res) {
    var result= catalogueMapper.getMagazines((magazine) => {genFilter(magazine, req.body.filters)});
    res.status(200);
    res.json(result);
}

exports.getMovies = async function(req, res) {
    var result= catalogueMapper.getMovies((movie) => {genFilter(movie, req.body.filters)});
    res.status(200);
    res.json(result);
}
//</editor-fold>

genFilter = function(item, filters){
    var toReturn = true;
    for(var filter in filters){
        if(isNaN(filter) || isNaN(item[filter])){
            toReturn = toReturn && (filter === undefined || item[filter].toLowerCase().includes(filter.toLowerCase()));
        } else {
            toReturn = toReturn && (filter === undefined || item[filter] === filter);
        }
    };
    return toReturn;
}

handleException = function(res, exception) {
    var message;
    switch(exception){
        case Exceptions.InternalServerError:
        default:
            message = "InternalServerError";
            res.status(500);
    }
    res.json({err: message});
}