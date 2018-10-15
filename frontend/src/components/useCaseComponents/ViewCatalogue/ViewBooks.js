import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import './ViewBooks.css';

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
        fetch('/api/catalogue/getBooks')
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
            <div className="container">
                <div className="fixed" style={style.body}>
                    <form style={style.label} onSubmit={this.handleSubmit} method="POST">
                        <TextField
                            label="Title"
                            name="title"
                            margin="dense"
                            value={this.state.title}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Author"
                            name="author"
                            margin="dense"
                            value={this.state.author}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Format"
                            name="format"
                            margin="dense"
                            value={this.state.format}
                            style={style.format}
                            onChange={this.handleChange} />
                        <TextField
                            label="Pages"
                            name="pages"
                            margin="dense"
                            value={this.state.pages}
                            style={style.page}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Publisher"
                            name="publisher"
                            margin="dense"
                            value={this.state.publisher}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Language"
                            name="language"
                            margin="dense"
                            value={this.state.language}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="ISBN-10"
                            name="isbn10"
                            margin="dense"
                            value={this.state.isbn10}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="ISBN-13"
                            name="isbn13"
                            margin="dense"
                            value={this.state.isbn13}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <Input type="submit" style={style.label}>
                            Add
                        </Input>
                    </form>
                    {bookAddedMessage}
                </div>
                <div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Format</TableCell>
                                <TableCell>Pages</TableCell>
                                <TableCell>Publisher</TableCell>
                                <TableCell>ISBN-10</TableCell>
                                <TableCell>ISBN-13</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.books.map((book, i) =>
                                <TableRow key={i}>
                                    <TableCell>
                                        {book.title}
                                    </TableCell>
                                    <TableCell>
                                        {book.author}
                                    </TableCell>
                                    <TableCell>
                                        {book.format}
                                    </TableCell>
                                    <TableCell>
                                        {book.pages}
                                    </TableCell>
                                    <TableCell>
                                        {book.publisher}
                                    </TableCell>
                                    <TableCell>
                                        {book.isbn10}
                                    </TableCell>
                                    <TableCell>
                                        {book.isbn13}
                                    </TableCell>
                                    <TableCell>
                                        <Button color="primary" onClick={() => { this.modifyBook(book) }}>Edit</Button>
                                        <Button color="secondary" onClick={() => { this.removeBooks(book.isbn10) }}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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
        this.setState({ [e.target.name]: e.target.value, bookAdded: false });
    }

    modifyBook(book) {
        console.log(book);

        this.setState({
            title: book.title,
            author: book.author,
            format: book.format,
            pages: book.pages,
            publisher: book.publisher,
            language: book.language,
            isbn10: book.isbn10,
            isbn13: book.isbn13
        })
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

    async removeBooks(isbn) {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/removeBooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isbn10: isbn })
            }).then((res => {
                if (res.status === 200) {
                    console.log("deleted book");
                } else {
                    console.log(res)
                }
            })).then(() => { this.componentDidMount(); });
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
        let isbn13 = props.isbn13;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addBook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, format, pages, publisher, language, isbn10, isbn13 })
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

const style = {
    body: {
        margin: 30
    },
    page: {
        marginLeft: 10,
        width: 90
    },
    format: {
        width: 200
    },
    textField: {
        width: 300
    },
};
