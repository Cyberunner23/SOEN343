class Book {
    constructor(props) {
        this.title = props.title;
        this.author = props.author;
        this.format = props.format;
        this.pages = props.pages;
        this.publisher = props.publisher;
        this.language = props.language;
        this.isbn10 = props.isbn10;
        this.isbn13 = props.isbn13;
    }
}

exports.Book = Book;