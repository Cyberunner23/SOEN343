import React, { Component } from 'react';

export default class ViewBooks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            author: '',
            format: '',
            pages: '',
            publisher: '',
            language: '',
            isbn10: '',
            isbn13: '',
            app: props.app,
            books: [],
            bookAdded: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('/api/getBooks')
            .then(res => {
                res.json().then(
                    books => this.setState({ books: books })
                )
            });
    }

    render() {
        var bookAddedMessage;
        if (this.state.bookAdded) {
            bookAddedMessage = (
                <div>{this.state.bookAddedMessage}</div>
            )
        }
        var content;
        content = (

            <div>
                <ul>
                    {this.state.books.map(book =>
                        <li key={book.title}>{book.title}</li>
                    )}
                </ul>

                <div className='UseCaseComponent'>
                    <form onSubmit={this.handleSubmit} method="POST">
                        <label>
                            Title:
        <input type="text" name="title" onChange={this.handleChange} />
                        </label>
                        <label>
                            Author:
        <input type="text" name="author" onChange={this.handleChange} />
                        </label>
                        <label>
                            Format:
        <input type="text" name="format" onChange={this.handleChange} />
                        </label>
                        <label>
                            Pages:
        <input type="text" name="pages" onChange={this.handleChange} />
                        </label>
                        <label>
                            Publisher:
        <input type="text" name="publisher" onChange={this.handleChange} />
                        </label>
                        <label>
                            Language:
        <input type="text" name="language" onChange={this.handleChange} />
                        </label>
                        <label>
                            ISBN-10:
        <input type="text" name="isbn10" onChange={this.handleChange} />
                        </label>
                        <label>
                            ISBN-13:
        <input type="text" name="isbn13" onChange={this.handleChange} />
                        </label>
                        <button onClick={this.handleSubmit}>Submit</button>
                    </form>
                    {bookAddedMessage}
                </div>
            </div>
        );

        return (
            <div className='ViewBooksComponent UseCaseComponent'>
                <h2>Books</h2>
                {content}
            </div>
        )
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, bookAdded: false});
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.addBook(this.state)
            .then((book) => {
                if (book !== null) {
                    console.log('Book added successfully');
                    this.setState({ bookAdded: true, bookAddedMessage: 'New book ' + book.title + ' added' })
                } else {
                    console.log('Book already added');
                    this.setState({ bookAdded: true, bookAddedMessage: 'book already added' })
                }
            }).then(() => {
                this.componentDidMount();
            })
    }

    async addBook(props) {
        let title = props.title;
        let author = props.author;
        let format = props.format;
        let pages = props.pages;
        let publisher = props.publisher;
        let language = props.language;
        let isbn10 = props.isbn10;
        let isbn13 = props.isbn13

        return new Promise((resolve, reject) => {
            fetch('/api/addBook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({title, author, format, pages, publisher, language, isbn10, isbn13})
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((book) => {
                        resolve(book);
                    })
                }
                else {
                    resolve(null);
                }
            });
        })
    }
}
