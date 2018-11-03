//<editor-fold desc="Constants">
const masterGateway = require('../gateways/MasterGateway').getInstance();
//</editor-fold>

persistChangesToDatabase = () => {
    setInterval(() => {
        masterGateway.executeTransaction()
        .catch(exception => {
            console.log('Something went wrong when attempting to persist catalogue changes to the database');
        })
    }, 10000)
}

class CatalogueController {

    constructor () {
        persistChangesToDatabase();
    }
}

const instance = new CatalogueController();
exports.getInstance = () => {
    return instance;
}

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