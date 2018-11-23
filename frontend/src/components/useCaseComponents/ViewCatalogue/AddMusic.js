import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

export default class AddMusic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: '',
            title: '',
            artist: '',
            label: '',
            releaseDate: '',
            asin: '',
            numAvailable: '',
			numTotal: '',
            app: props.app,
            musics: [],
            musicAdded: false,
            authToken: props.app.state.currentUser.authToken
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        fetch('/api/catalogue/getMusics')
            .then(res => {
                res.json().then(
                    musics => this.setState({ musics: musics })
                )
            });
    }

    render() {
        var musicAddedMessage;
        if (this.state.musicAdded) {
            musicAddedMessage = (
                <div>{this.state.musicAddedMessage}</div>
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
                        label="Type"
                        name="type"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Artist"
                        name="artist"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Label"
                        name="label"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Released Date"
                        name="releaseDate"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="ASIN"
                        name="asin"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Copies Available"
                        name="numAvailable"
                        margin="dense"
                        style={style.page}
                        onChange={this.handleChange} />
                    <br/>
                    <Input type="submit" style={style.label}>
                        Add
                    </Input>
                </form>
                {musicAddedMessage}
            </div>
        );

        return (
            <div className='ViewMusicComponent UseCaseComponent'>
                <h2>Music</h2>
                {content}
            </div>
        )
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, musicAdded: false });
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.addMusic(this.state)
            .then((music) => {
                if (music !== null) {
                    console.log('Music added successfully');
                    this.setState({ musicAdded: true, musicAddedMessage: 'New music ' + music.title + ' added' })
                } else {
                    console.log('Music already added');
                    this.setState({ musicAdded: true, musicAddedMessage: 'Music already added' })
                }
            }).then(() => {
            this.componentDidMount();
        })
    }

    async addMusic(props) {
        let title = props.title;
        let type = props.type;
        let artist = props.artist;
        let label = props.label;
        let releaseDate = props.releaseDate;
        let asin = props.asin;
        let numAvailable = props.numAvailable;
		let numTotal= props.numTotal;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addMusic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, type, artist, label, releaseDate, asin, numAvailable, numTotal, authToken: this.state.authToken})
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((music) => {
                        resolve(music);
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