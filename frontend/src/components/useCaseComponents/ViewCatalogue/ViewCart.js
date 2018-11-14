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

export default class ViewCart extends Component {

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
                {bookModifiedMessage}
                <Table style={style.format}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('title')} direction={'desc'}>Title</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('author')} direction={'desc'}>Type</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('isbn13')} direction={'desc'}>ID</TableSortLabel>
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
                                    {book.isbn13}
                                </TableCell>
                                {this.state.is_admin === 0 &&
                                <TableCell>
                                    <Button color="secondary" onClick={() => { this.removeBooks(book.isbn13) }} disabled>Remove</Button>
                                </TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Button color="primary" disabled>Loan Items</Button>
            </div>
        );

        return (
            <div className='ViewCartComponent UseCaseComponent'>
                <h2>My Cart</h2>
                {content}
            </div>
        )
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, bookModified: false, bookModifiedMessage: '' });
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