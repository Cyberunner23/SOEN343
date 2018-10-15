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

export default class ViewMusics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: '',
            title: '',
            artist: '',
            label: '',
            releaseDate: '',
            asin: '',
            app: props.app,
            musics: [],
            musicAdded: false
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
            <div className="container">
                <div style={style.body}>
                    <h1>Music</h1>
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
                            label="Type"
                            name="type"
                            margin="dense"
                            value={this.state.type}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Artist"
                            name="artist"
                            margin="dense"
                            value={this.state.artist}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Label"
                            name="label"
                            margin="dense"
                            value={this.state.label}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Released Date"
                            name="releaseDate"
                            margin="dense"
                            value={this.state.releaseDate}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="ASIN"
                            name="asin"
                            margin="dense"
                            value={this.state.asin}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <Input type="submit" style={style.label}>
                            Add
                        </Input>
                    </form>
                    {musicAddedMessage}
                </div>
                <div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Artist</TableCell>
                                <TableCell>Label</TableCell>
                                <TableCell>Released Date</TableCell>
                                <TableCell>ASIN</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.musics.map((music, i) =>
                                <TableRow key={i}>
                                    <TableCell>
                                        {music.title}
                                    </TableCell>
                                    <TableCell>
                                        {music.type}
                                    </TableCell>
                                    <TableCell>
                                        {music.artist}
                                    </TableCell>
                                    <TableCell>
                                        {music.label}
                                    </TableCell>
                                    <TableCell>
                                        {music.releaseDate}
                                    </TableCell>
                                    <TableCell>
                                        {music.asin}
                                    </TableCell>
                                    <TableCell>
                                        <Button color="primary" onClick={() => { this.modifyMusic(music) }}>Edit</Button>
                                        <Button color="secondary" onClick={() => { this.removeMusics(music.title) }}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
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

    modifyMusic(music) {
        this.setState({
            type: music.type,
            title: music.title,
            artist: music.artist,
            label: music.label,
            releaseDate: music.releaseDate,
            asin: music.asin
        });
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

    async removeMusics(title) {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/removeMusics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title })
            }).then((res => {
                if (res.status === 200) {
                    console.log("deleted music");
                } else {
                    console.log(res)
                }
            })).then(() => { this.componentDidMount(); });
        })
    }

    async addMusic(props) {
        let title = props.title;
        let type = props.type;
        let artist = props.artist;
        let label = props.label;
        let releaseDate = props.releaseDate;
        let asin = props.asin;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addMusic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, type, artist, label, releaseDate, asin })
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
};