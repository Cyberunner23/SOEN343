//<editor-fold desc="Constants">
const masterGateway = require('../gateways/MasterGateway').getInstance();
const bookMapper = require('../mappers/BookMapper').getInstance();
const magazineMapper = require('../mappers/MagazineMapper').getInstance();
const musicMapper = require('../mappers/MusicMapper').getInstance();
const movieMapper = require('../mappers/MovieMapper').getInstance();

const identifyUser = require('./UserController').identifyUser;

const Exceptions = require('../Exceptions').Exceptions;

persistChangesToDatabase = () => {
    setInterval(() => {
        masterGateway.executeTransaction()
        .catch(exception => {
            console.log('Something went wrong when attempting to presist catalogue changes to the database');
        })
    }, 30000)
}

class CatalogueController {

    constructor () {
        persistChangesToDatabase();
    }

    //<editor-fold desc="Get methods" defaultstate="collapsed">
    async getBooks (req, res) {
        var result= bookMapper.getBooks()
        res.status(200);
        res.json(result);
    }
    async getMusics (req, res) {
        var result= musicMapper.getMusics()
        res.status(200);
        res.json(result);
    }
    async getMagazines (req, res) {
        var result= magazineMapper.getMagazines()
        res.status(200);
        res.json(result);
    }
    async getMovies (req, res) {
        var result= movieMapper.getMovies()
        res.status(200);
        res.json(result);
    }
    //</editor-fold>
    
    //<editor-fold desc="Add/Modify/Delete methods" defaultstate="collapsed">

    // TODO: verify that current user is an administrator before  executing any of the methods below

    //<editor-fold desc="Addition methods">
    async addBook (req, res) {
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // isbn is unique so use isbn to check for exiting book
            var result = bookMapper.getBooks(book => {
                return book.isbn13 === req.body.isbn13;
            })
            if(result.length === 0){
                bookMapper.addBook(req.body)
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

    async addMusic (req, res) {
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // asin is unique so use asin to check for existing music
            var result = musicMapper.getMusics(music => {
                return music.asin === req.body.asin;
            })
            if(result.length === 0){
                musicMapper.addMusic(req.body)
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

    async addMagazine (req, res) {
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // use isbn to check for existing magazine
            var result = magazineMapper.getMagazines(magazine => {
                return magazine.isbn13 === req.body.isbn13;
            })
            if(result.length === 0){
                magazineMapper.addMagazine(req.body)
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

    async addMovie (req, res){
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // use title, director, and release date to check for existing movie
            var result = movieMapper.getMovies(music => {
                return music.eidr === req.body.eidr;
            })
            if(result.length === 0){
                movieMapper.addMovie(req.body)
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
    async modifyBook (req, res) {
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // find book
            var result = bookMapper.getBooks(book => {
                return book.isbn13 === req.body.isbn13;
            })
            if(result.length === 1){
                bookMapper.modifyBooks(req.body, book => {
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

    async modifyMusic (req, res) {
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // find music
            var result = musicMapper.getMusics(music => {
                return music.asin === req.body.asin;
            })
            if(result.length === 1){
                musicMapper.modifyMusics(req.body, music => {
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

    async modifyMagazine (req, res) {
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // find magazine
            var result = magazineMapper.getMagazines(magazine => {
                return magazine.isbn13 === req.body.isbn13;
            })
            if(result.length === 1){
                magazineMapper.modifyMagazines(req.body, magazine => {
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

    async modifyMovie (req, res){
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // find movie
            var result = movieMapper.getMovies(movie => {
                return movie.eidr === req.body.eidr;
            })
            if(result.length === 1){
                movieMapper.modifyMovies(req.body, movie => {
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
    async deleteBook (req, res) {
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // find book
            var result = bookMapper.getBooks(book => {
                return book.isbn13 === req.body.isbn13;
            })
            if(result.length === 1){
                bookMapper.removeBooks(book => {
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

    async deleteMusic (req, res) {
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // find music
            var result = musicMapper.getMusics(music => {
                return music.asin === req.body.asin;
            })
            if(result.length === 1){
                musicMapper.removeMusics(music => {
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

    async deleteMagazine (req, res) {
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // find magazine
            var result = magazineMapper.getMagazines(magazine => {
                return magazine.isbn13 === req.body.isbn13;
            })
            if(result.length === 1){
                magazineMapper.removeMagazines(magazine => {
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

    async deleteMovie (req, res){
        identifyUser(req.body.authToken)
        .then((user) => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // find movie
            var result = movieMapper.getMovies(movie => {
                return movie.eidr === req.body.eidr;
            })
            if(result.length === 1){
                movieMapper.removeMovies(movie => {
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
}

//</editor-fold>

exports.search = async function (req, res) {
    
}

const instance = new CatalogueController();
exports.getInstance = () => {
    return instance;
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