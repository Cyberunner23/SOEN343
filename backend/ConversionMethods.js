// These conversion methods are artefacts from the old CatalogueController
// The CatalogueController was split into record-specific controllers
// These methods are not currently used, but are kept here in case we need them in the future

convertToFrontendView = (catalogueItems) => {
    viewItems = [];
    catalogueItems.forEach((item) => {
        viewItems.push(item);
    });
    return viewItems;
}

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
    let count = book.count;
    return (
        {title, author, format, pages, publisher, datePublished, language, isbn10, isbn13, count}
    );
}

convertToFrontendMusic = (music) => {
    let title = music.title;
    let artist = music.artist;
    let label = music.label;
    let type = music.type;
    let releaseDate = music.releaseDate;
    let asin = music.asin;
    let count = music.count;
    return (
        {title, artist, label, type, releaseDate, asin, count}
    );
}

convertToFrontendMagazine = (magazine) => {
    let title = magazine.title;
    let publisher = magazine.publisher;
    let publishDate = magazine.publishDate;
    let language = magazine.language;
    let isbn10 = magazine.isbn10;
    let isbn13 = magazine.isbn13;
    let count = magazine.count;
    return (
        {title, publisher, publishDate, language, isbn10, isbn13, count}
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
    let count = movie.count;
    return (
        {title, director, producers, actors, language, subtitles, dubbed, releaseDate, runTime, eidr, count}
    );
}