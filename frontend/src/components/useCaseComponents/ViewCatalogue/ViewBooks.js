import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const sorter = require('../../../helper_classes/Sorter.js').getInstance();

export default class ViewBooks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '', author: '', format: '', pages: '', publisher: '', language: '', isbn10: '', isbn13: '',
            titleFilter: '', authorFilter: '', formatFilter: '', pagesFilter: '', publisherFilter: '', languageFilter: '', isbn10Filter: '', isbn13Filter: '',
            app: props.app,
            books: [],
            modifyBook: false,
            bookModified: false,
            desc: false,
            authToken: props.app.state.currentUser.authToken,
            is_admin: props.is_admin
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
                <div style={style.format}>
                    <Typography>Filter By...</Typography>
                    <TextField style={style.field} label="title" name="titleFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="author" name="authorFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="format" name="formatFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="pages" name="pagesFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="publisher" name="publisherFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="language" name="languageFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="ISBN-10" name="isbn10Filter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="ISBN-13" name="isbn13Filter" margin="dense" onChange={this.handleChange} /><br/>
                    <Button color="primary" onClick={() => { this.filter() }}>Search</Button>
                </div>
                {bookModifiedMessage}
                <Table style={style.format}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('title')} direction={'desc'}>Title</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('author')} direction={'desc'}>Author</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('format')} direction={'desc'}>Format</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('pages')} direction={'desc'}>Pages</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('publisher')} direction={'desc'}>Publisher</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('language')} direction={'desc'}>Language</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('isbn10')} direction={'desc'}>ISBN-10</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('isbn13')} direction={'desc'}>ISBN-13</TableSortLabel>
                            </TableCell>
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
                                {this.state.is_admin === 1 &&
                                <TableCell>
                                    {(this.state.modifyBook && this.state.isbn13 === book.isbn13) ?
                                    (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                                    (<Button color="primary" onClick={() => { this.modifyBookState(book) }}>Edit</Button>)}
                                    <Button color="secondary" onClick={() => { this.removeBooks(book.isbn13) }}>Delete</Button>
                                </TableCell>}
                                {this.state.is_admin === 0 &&
                                <TableCell>
                                    <Button variant="contained" color="secondary" disabled>Add to Cart</Button>
                                </TableCell>}
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

    sort(field) {
        if (field === 'pages') {
            sorter.intSort(this.state.books, field, this.state.desc);
        }
        else {
            sorter.stringSort(this.state.books, field, this.state.desc);
        }
        this.setState({books: this.state.books, desc: !this.state.desc});
    }

    filter() {
        let title = this.state.titleFilter;
        let author = this.state.authorFilter;
        let format = this.state.formatFilter;
        let pages = this.state.pagesFilter;
        let publisher = this.state.publisherFilter;
        let language = this.state.languageFilter;
        let isbn10 = this.state.isbn10Filter;
        let isbn13 = this.state.isbn13Filter;
        let jsonObject = {title, author, format, pages, publisher, language, isbn10, isbn13};

        Object.keys(jsonObject).forEach((key) => (jsonObject[key] === "") && delete jsonObject[key]);

        //convert json to url params
        let url = Object.keys(jsonObject).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(jsonObject[k])
        }).join('&');

        fetch('/api/catalogue/getBooks?' + url, {
            method: 'GET'
        }).then(res => {
            res.json().then(
                books => this.setState({ books: books })
            )
        });
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

const style = {
    format: {
        marginTop: 25,
        marginBottom: 25
    },
    field: {
        paddingRight: 10
    }
}