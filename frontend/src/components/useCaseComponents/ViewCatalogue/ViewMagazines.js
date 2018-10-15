import React, { Component } from 'react';
import './ViewBooks.css';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

export default class ViewMagazines extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            publisher: '',
            date: '',
            language: '',
            isbn10: '',
            isbn13: '',
            app: props.app,
            magazines: [],
            magazineAdded: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('/api/catalogue/getMagazines')
            .then(res => {
                res.json().then(
                    magazines => this.setState({ magazines: magazines })
                )
            });
    }

    render() {
        var magazineAddedMessage;
        if (this.state.magazineAdded) {
            magazineAddedMessage = (
                <div>{this.state.magazineAddedMessage}</div>
            )
        }
        var content;
        content = (
            <div className="container">
                <div style={style.body}>
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
                            label="Publisher"
                            name="publisher"
                            margin="dense"
                            value={this.state.publisher}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Date"
                            name="date"
                            margin="dense"
                            value={this.state.date}
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
                    {magazineAddedMessage}
                </div>
                <div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Publisher</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Language</TableCell>
                                <TableCell>ISBN-10</TableCell>
                                <TableCell>ISBN-13</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.magazines.map(magazine =>
                                <TableRow key={magazine.title}>
                                    <TableCell>
                                        {magazine.title}
                                    </TableCell>
                                    <TableCell>
                                        {magazine.publisher}
                                    </TableCell>
                                    <TableCell>
                                        {magazine.date}
                                    </TableCell>
                                    <TableCell>
                                        {magazine.language}
                                    </TableCell>
                                    <TableCell>
                                        {magazine.isbn10}
                                    </TableCell>
                                    <TableCell>
                                        {magazine.isbn13}
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => { this.modifyMagazine(magazine) }}>Edit</Button>
                                        <Button onClick={() => { this.removeMagazines(magazine.isbn10) }}> Delete</Button>
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
                <h2>Magazines</h2>
                {content}
            </div>
        )
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, magazineAdded: false});
    }

    modifyMagazine(magazine) {
        this.setState({
            title: magazine.title,
            publisher: magazine.publisher,
            date: magazine.date,
            language: magazine.language,
            isbn10: magazine.isbn10,
            isbn13: magazine.isbn13
        })
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.addMagazine(this.state)
            .then((magazine) => {
                if (magazine !== null) {
                    console.log('Magazine added successfully');
                    this.setState({ magazineAdded: true, magazineAddedMessage: 'New magazine ' + magazine.title + ' added' })
                } else {
                    console.log('Magazine already added');
                    this.setState({ magazineAdded: true, magazineAddedMessage: 'magazine already added' })
                }
            }).then(() => {
                this.componentDidMount();
            })
    }

    async removeMagazines(isbn) {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/removeMagazines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isbn10: isbn })
            }).then((res => {
                if (res.status === 200) {
                    console.log("deleted magazine");
                } else {
                    console.log(res)
                }
            })).then(() => { this.componentDidMount(); });
        })
    }

    async addMagazine(props) {
        let title = props.title;
        let publisher = props.publisher;
        let date= props.date;
        let language= props.language;
        let isbn10=props.isbn10;
        let isbn13=props.isbn13;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addMagazine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({title, publisher, date, language, isbn10, isbn13})
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((magazine) => {
                        resolve(magazine);
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
    textField: {
        width: 300
    },
};