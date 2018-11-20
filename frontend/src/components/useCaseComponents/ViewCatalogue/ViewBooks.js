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
            bookItemBool: false,
            bookItem: [],
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
                                <TableSortLabel onClick={() => this.sort('isbn13')} direction={'desc'}>ISBN-13</TableSortLabel>
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.books.map((book, i) =>
                            <TableRow key={i}>
                                <TableCell>
                                    {(book.title)}
                                </TableCell>
                                <TableCell>
                                    {(book.author)}
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
                                    <Button color="primary" onClick={() => { this.detailedBook(book, true) }}>View Details</Button>
                                    <Button variant="contained" color="secondary" onClick={() => { this.addBookToCart(book.isbn13) }} disabled>Add to Cart</Button>
                                </TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        );

        var itemDetails;
        itemDetails = (
            <div className="fixed" style={style.body}>
                <Button color="primary" onClick={() => { this.detailedBook([], false) }}>Back to Books View</Button>
                <br/>
                <TextField
                        label="Title"
                        name="title"
                        margin="normal"
                        defaultValue= {(this.state.bookItem.title)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyBook && this.state.isbn13 === this.state.bookItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="Author"
                        name="author"
                        margin="normal"
                        defaultValue= {(this.state.bookItem.author)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyBook && this.state.isbn13 === this.state.bookItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="Format"
                        name="format"
                        margin="normal"
                        defaultValue= {(this.state.bookItem.format)}
                        style={style.format}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyBook && this.state.isbn13 === this.state.bookItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="Pages"
                        name="pages"
                        margin="normal"
                        defaultValue= {(this.state.bookItem.pages)}
                        style={style.page}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyBook && this.state.isbn13 === this.state.bookItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="Publisher"
                        name="publisher"
                        margin="normal"
                        defaultValue= {(this.state.bookItem.publisher)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyBook && this.state.isbn13 === this.state.bookItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="Language"
                        name="language"
                        margin="normal"
                        defaultValue= {(this.state.bookItem.language)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyBook && this.state.isbn13 === this.state.bookItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="ISBN-10"
                        name="isbn10"
                        margin="normal"
                        defaultValue= {(this.state.bookItem.isbn10)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyBook && this.state.isbn13 === this.state.bookItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="ISBN-13"
                        name="isbn13"
                        margin="normal"
                        defaultValue= {(this.state.bookItem.isbn13)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyBook && this.state.isbn13 === this.state.bookItem.isbn13) ? false : true} />
                    <br/>
                    {this.state.is_admin === 0 &&
                    <p>
                        <Button variant="contained" color="secondary" onClick={() => { this.sequenceBook(this.state.bookItem, false) }}>Previous</Button>
                        <Button variant="contained" color="secondary" onClick={() => { this.addBookToCart(this.state.bookItem.isbn13) }} disabled>Add to Cart</Button>
                        <Button variant="contained" color="secondary" onClick={() => { this.sequenceBook(this.state.bookItem, true) }}>Next</Button>
                    </p>}
                    {this.state.is_admin === 1 &&
                    <p>
                    {(this.state.modifyBook && this.state.isbn13 === this.state.bookItem.isbn13) ?
                        (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                        (<Button color="primary" onClick={() => { this.modifyBookState(this.state.bookItem) }}>Edit</Button>)}
                        <Button color="secondary" onClick={() => { this.removeBooks(this.state.bookItem.isbn13) }}>Delete</Button>
                    </p>}
            </div>
        );

        return (
            <div className='ViewBooksComponent UseCaseComponent'>
                <h2>Books</h2>
                {this.state.bookItemBool ? itemDetails : content}
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
            bookItem: book,
            bookItemBool: true,
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

    
    detailedBook(book, bool) {
        this.setState({
            bookItem: book,
            bookItemBool: bool
        });
    }

    async sequenceBook(book, bool){
        var index =  this.state.books.indexOf(book);
        console.log(index);
        if(bool) index = (this.state.books.length == index ? index : ++index);
        else index = (index == 0 ? 0 : --index);
        console.log(index);
        this.setState({
            bookItem: this.state.books[index]
        });
    }

    async addBookToCart(props){
        let isbn13 = props.isbn13;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addToCart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({isbn13 , authToken: this.state.authToken})
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