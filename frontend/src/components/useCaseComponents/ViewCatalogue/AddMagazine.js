import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

export default class AddMagazine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            publisher: '',
            date: '',
            language: '',
            isbn10: '',
            isbn13: '',
            numAvailable: '',
			numTotal: '',
            app: props.app,
            magazines: [],
            magazineAdded: false,
            authToken: props.app.state.currentUser.authToken
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
            <div style={style.body}>
                <form style={style.label} onSubmit={this.handleSubmit} method="POST">
                    <TextField
                        label="Title"
                        name="title"
                        margin="dense"
                        style={style.textField}
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
                        label="Date"
                        name="date"
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
                {magazineAddedMessage}
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

    async addMagazine(props) {
        let title = props.title;
        let publisher = props.publisher;
        let date= props.date;
        let language= props.language;
        let isbn10=props.isbn10;
        let isbn13=props.isbn13;
        let numAvailable = props.numAvailable;
		let numTotal= props.numTotal;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addMagazine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({title, publisher, date, language, isbn10, isbn13, numAvailable, numTotal, authToken: this.state.authToken})
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
    page: {
        marginLeft: 10,
        width: 90
    },
};