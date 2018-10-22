import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

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
            modifyBook: false,
            bookModified: false,
            authToken: props.app.state.currentUser.authToken
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        fetch('/api/catalogue/getBooks')
            .then(res => {
                res.json().then(
                    books => this.setState({ books: books })
                )
            });
    }

    render() {
        var bookModifiedMessage;
        if (this.state.bookModified) {
            bookModifiedMessage = (
                <div>{this.state.bookModifiedMessage}</div>
            )
        }
        var content;
        content = (
            <div>
                {bookModifiedMessage}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Format</TableCell>
                            <TableCell>Pages</TableCell>
                            <TableCell>Publisher</TableCell>
                            <TableCell>Language</TableCell>
                            <TableCell>ISBN-10</TableCell>
                            <TableCell>ISBN-13</TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.books.map((book, i) =>
                            <TableRow key={i}>
                                <TableCell>
                                    {(this.state.modifyBook && this.state.isbn13 === book.isbn13) ? (<TextField
                                        name="title"
                                        margin="dense"
                                        defaultValue={book.title}
                                        onChange={this.handleChange} />) : (book.title)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyBook && this.state.isbn13 === book.isbn13) ? (<TextField
                                        name="author"
                                        margin="dense"
                                        defaultValue={book.author}
                                        onChange={this.handleChange} />) : (book.author)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyBook && this.state.isbn13 === book.isbn13) ? (<TextField
                                        name="format"
                                        margin="dense"
                                        defaultValue={book.format}
                                        onChange={this.handleChange} />) : (book.format)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyBook && this.state.isbn13 === book.isbn13) ? (<TextField
                                        name="pages"
                                        margin="dense"
                                        defaultValue={book.pages}
                                        onChange={this.handleChange} />) : (book.pages)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyBook && this.state.isbn13 === book.isbn13) ? (<TextField
                                        name="publisher"
                                        margin="dense"
                                        defaultValue={book.publisher}
                                        onChange={this.handleChange} />) : (book.publisher)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyBook && this.state.isbn13 === book.isbn13) ? (<TextField
                                        name="language"
                                        margin="dense"
                                        defaultValue={book.language}
                                        onChange={this.handleChange} />) : (book.language)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyBook && this.state.isbn13 === book.isbn13) ? (<TextField
                                        name="isbn10"
                                        margin="dense"
                                        defaultValue={book.isbn10}
                                        onChange={this.handleChange} />) : (book.isbn10)}
                                </TableCell>
                                <TableCell>
                                    {book.isbn13}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyBook && this.state.isbn13 === book.isbn13) ?
                                        (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                                        (<Button color="primary" onClick={() => { this.modifyBookState(book) }}>Edit</Button>)}
                                    <Button color="secondary" onClick={() => { this.removeBooks(book.isbn13) }}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
        this.setState({ [e.target.name]: e.target.value, bookModified: false, bookModifiedMessage: '' });
    }

    modifyBookState(book) {
        this.setState({
            title: book.title,
            author: book.author,
            format: book.format,
            pages: book.pages,
            publisher: book.publisher,
            language: book.language,
            isbn10: book.isbn10,
            isbn13: book.isbn13,
            bookModifiedMessage: '',
            modifyBook: true
        })
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.modifyBook(this.state)
            .then((book) => {
                if (book !== null) {
                    console.log('Book modified successfully');
                    this.setState({ modifyBook: false, bookModified: true, bookModifiedMessage: 'Book ' + book.title + ' modified' })
                } else {
                    console.log('Modification could not be completed');
                    this.setState({ bookModified: true, bookModifiedMessage: 'Modification could not be completed' })
                }
            }).then(() => {
                this.componentDidMount();
            })
    }

    async removeBooks(isbn) {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/removeBooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({isbn13: isbn, authToken: this.state.authToken })
            }).then((res => {
                if (res.status === 200) {
                    console.log("deleted book");
                    this.setState({ modifyBook: false, bookModified: true, bookModifiedMessage: 'Book removed successfully' })
                } else {
                    console.log(res)
                    this.setState({ bookModified: true, bookModifiedMessage: 'Book could not be removed' })
                }
            })).then(() => { this.componentDidMount(); });
        })
    }

    async modifyBook(props) {
        let title = props.title;
        let author = props.author;
        let format = props.format;
        let pages = props.pages;
        let publisher = props.publisher;
        let language = props.language;
        let isbn10 = props.isbn10;
        let isbn13 = props.isbn13;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/modifyBook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, format, pages, publisher, language, isbn10, isbn13 , authToken: this.state.authToken})
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