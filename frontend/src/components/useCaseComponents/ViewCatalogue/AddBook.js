import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

export default class AddBook extends Component {

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
            numAvailable: '',
			numTotal: '',
            app: props.app,
            books: [],
            bookAdded: false,
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
        var bookAddedMessage;
        if (this.state.bookAdded) {
            bookAddedMessage = (
                <div>{this.state.bookAddedMessage}</div>
            )
        }
        var content;
        content = (
            <div className="fixed" style={style.body}>
                <form style={style.label} onSubmit={this.handleSubmit} method="POST">
                    <TextField
                        label="Title"
                        name="title"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Author"
                        name="author"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Format"
                        name="format"
                        margin="dense"
                        style={style.format}
                        onChange={this.handleChange} />
                    <TextField
                        label="Pages"
                        name="pages"
                        margin="dense"
                        style={style.page}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Publisher"
                        name="publisher"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Language"
                        name="language"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="ISBN-10"
                        name="isbn10"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="ISBN-13"
                        name="isbn13"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Copies Available"
                        name="numAvailable"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Copies Total"
                        name="numTotal"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <Input type="submit" style={style.label}>
                        Add
                    </Input>
                </form>
                {bookAddedMessage}
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
        let isbn13 = props.isbn13;
        let numAvailable = props.numAvailable;
		let numTotal= props.numTotal;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addBook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, format, pages, publisher, language, isbn10, isbn13, numAvailable, numTotal, authToken: this.state.authToken})
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
