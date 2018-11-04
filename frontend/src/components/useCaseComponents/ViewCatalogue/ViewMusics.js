import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const sorter = require('../../../helper_classes/Sorter.js').getInstance();

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
            modifyMusic: false,
            musicModified: false,
            desc: false,
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
        var musicModifiedMessage;
        if (this.state.musicModified) {
            musicModifiedMessage = (
                <div>{this.state.musicModifiedMessage}</div>
            )
        }
        var content;
        content = (
            <div>
                {musicModifiedMessage}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('title')} direction={'desc'}>Title</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('type')} direction={'desc'}>Type</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('artist')} direction={'desc'}>Artist</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('label')} direction={'desc'}>Label</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('releaseDate')} direction={'desc'}>Release Date</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('asin')} direction={'desc'}>ASIN</TableSortLabel>
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.musics.map((music, i) =>
                            <TableRow key={i}>
                                <TableCell>
                                    {(this.state.modifyMusic && this.state.asin === music.asin) ? (<TextField
                                        name="title"
                                        margin="dense"
                                        defaultValue={music.title}
                                        onChange={this.handleChange} />) : (music.title)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMusic && this.state.asin === music.asin) ? (<TextField
                                        name="type"
                                        margin="dense"
                                        defaultValue={music.type}
                                        onChange={this.handleChange} />) : (music.type)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMusic && this.state.asin === music.asin) ? (<TextField
                                        name="artist"
                                        margin="dense"
                                        defaultValue={music.artist}
                                        onChange={this.handleChange} />) : (music.artist)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMusic && this.state.asin === music.asin) ? (<TextField
                                        name="label"
                                        margin="dense"
                                        defaultValue={music.label}
                                        onChange={this.handleChange} />) : (music.label)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMusic && this.state.asin === music.asin) ? (<TextField
                                        name="releaseDate"
                                        margin="dense"
                                        defaultValue={music.releaseDate}
                                        onChange={this.handleChange} />) : (music.releaseDate)}
                                </TableCell>
                                <TableCell>
                                    {music.asin}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMusic && this.state.asin === music.asin) ?
                                        (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                                        (<Button color="primary" onClick={() => { this.modifyMusicState(music) }}>Edit</Button>)}
                                    <Button color="secondary" onClick={() => { this.removeMusics(music.asin) }}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
        this.setState({ [e.target.name]: e.target.value, musicModified: false, musicModifiedMessage: '' });
    }

    modifyMusicState(music) {
        this.setState({
            type: music.type,
            title: music.title,
            artist: music.artist,
            label: music.label,
            releaseDate: music.releaseDate,
            asin: music.asin,
            musicModifiedMessage: '',
            modifyMusic: true
        });
    }

    sort(field) {
        if (field === 'asin') {
            sorter.intSort(this.state.musics, field, this.state.desc);
        }
        else {
            sorter.stringSort(this.state.musics, field, this.state.desc);
        }
        this.setState({musics: this.state.musics, desc: !this.state.desc});
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.modifyMusic(this.state)
            .then((music) => {
                if (music !== null) {
                    console.log('Music modified successfully');
                    this.setState({ modifyMusic: false, musicModified: true, musicModifiedMessage: 'Music ' + music.title + ' modified' })
                } else {
                    console.log('Modification could not be completed');
                    this.setState({ musicModified: true, musicModifiedMessage: 'Modification could not be completed' })
                }
            }).then(() => {
                this.componentDidMount();
            })
    }

    async removeMusics(asin) {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/removeMusics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asin: asin, authToken: this.state.authToken})
            }).then((res => {
                if (res.status === 200) {
                    console.log("deleted music");
                    this.setState({ modifyMusic: false, musicModified: true, musicModifiedMessage: 'Music removed successfully' })
                } else {
                    console.log(res)
                    this.setState({ musicModified: true, musicModifiedMessage: 'Music could not be removed' })
                }
            })).then(() => { this.componentDidMount(); });
        })
    }

    async modifyMusic(props) {
        let title = props.title;
        let type = props.type;
        let artist = props.artist;
        let label = props.label;
        let releaseDate = props.releaseDate;
        let asin = props.asin;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/modifyMusic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, type, artist, label, releaseDate, asin, authToken: this.state.authToken})
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