class Magazine {
    constructor(props) {
        this.title = props.title;
        this.publisher = props.publisher;
        this.date = props.date;
        this.language = props.language;
        this.isbn10 = props.isbn10;
        this.isbn13 = props.isbn13;
        this.count= props.count;
    }
}

exports.Magazine = Magazine;