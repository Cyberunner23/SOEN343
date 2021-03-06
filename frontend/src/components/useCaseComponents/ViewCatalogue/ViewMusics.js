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

export default class ViewMusics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: '', title: '', artist: '', label: '', releaseDate: '', asin: '', numAvailable: '', numTotal: '',
            typeFilter: '', titleFilter: '', artistFilter: '', labelFilter: '', releaseDateFilter: '', asinFilter: '', numAvailableFilter: '', numTotalFilter: '',
            app: props.app,
            musics: [],
            musicItemBool: false,
            musicItem: [],
            modifyMusic: false,
            musicModified: false,
            desc: false,
            lastSortField: '',
            authToken: props.app.state.currentUser.authToken,
            is_admin: props.is_admin
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
                <div style={style.type}>
                    <Typography>Filter By...</Typography>
                    <TextField style={style.field} label="title" name="titleFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="type" name="typeFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="artist" name="artistFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="label" name="labelFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="release date" name="releaseDateFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="ASIN" name="asinFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="numAvailable" name="numAvailableFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="numTotal" name="numTotalFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <Button color="primary" onClick={() => { this.filter() }}>Search</Button>
                </div>
                {musicModifiedMessage}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('title')}>Title</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('type')}>Type</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('artist')}>Artist</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('label')}>Label</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('releaseDate')}>Release Date</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('asin')}>ASIN</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('numAvailable')} direction={'desc'}>Copies Available</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('numTotal')} direction={'desc'}>Total Available</TableSortLabel>
                            </TableCell>
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
                                    {(music.numAvailable)}
                                </TableCell>
                                <TableCell>
                                    {(music.numTotal)}
                                </TableCell>
                                {this.state.is_admin === 1 &&
                            <TableCell>
                                {(this.state.modifyMusic && this.state.asin === music.asin) ?
                                (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                                (<Button color="primary" onClick={() => { this.modifyMusicState(music) }}>Edit</Button>)}
                                <Button color="secondary" onClick={() => { this.removeMusics(music.asin) }}>Delete</Button>
                            </TableCell>}
                            {this.state.is_admin === 0 &&
                            <TableCell>
                                <Button color="primary" onClick={() => { this.detailedMusic(music, true) }}>View Details</Button>
                                <Button variant="contained" color="secondary" disabled={music.numAvailable === 0} onClick={() => { this.addMusicToCart(music.asin) }}>Add to Cart</Button>
                            </TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    var itemDetails;
    itemDetails = (
        <div className="fixed" style={style.body} key={this.state.musicItem.asin}>
            <Button color="primary" onClick={() => { this.detailedMusic([], false) }}>Back to musics View</Button>
            <br/>
            <TextField
                    label="Title"
                    name="title"
                    margin="normal"
                    defaultValue= {(this.state.musicItem.title)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMusic && this.state.asin === this.state.musicItem.asin) ? false : true} />
                <br/>
                <TextField
                    label="Artist"
                    name="artist"
                    margin="normal"
                    defaultValue= {(this.state.musicItem.artist)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMusic && this.state.asin === this.state.musicItem.asin) ? false : true} />
                <br/>
                <TextField
                    label="Type"
                    name="type"
                    margin="normal"
                    defaultValue= {(this.state.musicItem.type)}
                    style={style.type}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMusic && this.state.asin === this.state.musicItem.asin) ? false : true} />
                <br/>
                <TextField
                    label="Label"
                    name="label"
                    margin="normal"
                    defaultValue= {(this.state.musicItem.label)}
                    style={style.page}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMusic && this.state.asin === this.state.musicItem.asin) ? false : true} />
                <br/>
                <TextField
                    label="Release Date"
                    name="releaseDate"
                    margin="normal"
                    defaultValue= {(this.state.musicItem.releaseDate)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMusic && this.state.asin === this.state.musicItem.asin) ? false : true} />
                <br/>
                <TextField
                    label="ASIN"
                    name="asin"
                    margin="normal"
                    defaultValue= {(this.state.musicItem.asin)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMusic && this.state.asin === this.state.musicItem.asin) ? false : true} />
                <br/>
                <TextField
                    label="Copies Available"
                    name="numAvailable"
                    margin="normal"
                    defaultValue= {(this.state.musicItem.numAvailable)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMusic && this.state.asin === this.state.musicItem.asin) ? false : true} />
                <br/>
                <TextField
                    label="Copies Total"
                    name="numTotal"
                    margin="normal"
                    defaultValue= {(this.state.musicItem.numTotal)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMusic && this.state.asin === this.state.musicItem.asin) ? false : true} />
                <br/>
                {this.state.is_admin === 0 &&
                <p>
                    <Button variant="contained" color="secondary" onClick={() => { this.sequenceMusic(this.state.musicItem, false) }}>Previous</Button>
                    <Button variant="contained" color="primary" disabled={this.state.musicItem.numAvailable === 0} onClick={() => { this.addMusicToCart(this.state.musicItem.asin) }}>Add to Cart</Button>
                    <Button variant="contained" color="secondary" onClick={() => { this.sequenceMusic(this.state.musicItem, true) }}>Next</Button>
                </p>}
                {this.state.is_admin === 1 &&
                <p>
                {(this.state.modifyMusic && this.state.asin === this.state.musicItem.asin) ?
                    (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                    (<Button color="primary" onClick={() => { this.modifyMusicState(this.state.musicItem) }}>Edit</Button>)}
                    <Button color="secondary" onClick={() => { this.removemusics(this.state.musicItem.asin) }}>Delete</Button>
                </p>}
        </div>
    );

        return (
            <div className='ViewMusicComponent UseCaseComponent'>
                <h2>Music</h2>
                {this.state.musicItemBool ? itemDetails : content}
            </div>
        )
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, musicModified: false, musicModifiedMessage: '' });
    }

    modifyMusicState(music) {
        this.setState({
            title: music.title,
            type: music.type,
            artist: music.artist,
            label: music.label,
            releaseDate: music.releaseDate,
            asin: music.asin,
            numAvailable: music.numAvailable,
            musicModifiedMessage: '',
            musicItem: music,
            musicItemBool: true,
            modifyMusic: true
        });
    }

    sort(field) {
        let currentState = this.state.desc;

        if(this.state.lastSortField !== field) {
            currentState = false;
        }
        else {
            currentState = !currentState;
        }

        if (field === ('asin')) {
            sorter.intSort(this.state.musics, field, currentState);
        }
        else {
            sorter.stringSort(this.state.musics, field, currentState);
        }
        this.setState({musics: this.state.musics, desc: currentState, lastSortField: field});
    }

    filter() {
        let title = this.state.titleFilter;
        let type = this.state.typeFilter;
        let artist = this.state.artistFilter;
        let label = this.state.labelFilter;
        let releaseDate = this.state.releaseDateFilter;
        let asin = this.state.asinFilter;
        let numAvailable = this.state.numAvailableFilter;
		let numTotal = this.state.numTotalFilter;
        let jsonObject = {title, type, artist, label, releaseDate, asin, numAvailable, numTotal};

        Object.keys(jsonObject).forEach((key) => (jsonObject[key] === "") && delete jsonObject[key]);

        //convert json to url params
        let url = Object.keys(jsonObject).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(jsonObject[k])
        }).join('&');

        fetch('/api/catalogue/getMusics?' + url, {
            method: 'GET'
        }).then(res => {
            res.json().then(
                musics => this.setState({ musics: musics })
            )
        });
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
        let numAvailable = props.numAvailable;
		let numTotal = props.numTotal;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/modifyMusic', {
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
    
    detailedMusic(music, bool) {
        this.setState({
            musicItem: music,
            musicItemBool: bool
        });
    }

    async sequenceMusic(music, bool){
        var index =  this.state.musics.indexOf(music);
        if(bool) index = ((this.state.musics.length - 1) === index ? index : ++index);
        else index = (index === 0 ? 0 : --index);
        this.setState({
            musicItem: this.state.musics[index]
        });
    }

    async addMusicToCart(asin){
        return new Promise((resolve, reject) => {
            fetch('/api/cartItem/addToCart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({mediaId: asin, mediaType: 'music', authToken: this.state.authToken})
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
    type: {
        marginTop: 25,
        marginBottom: 25
    },
    field: {
        paddingRight: 10
    }
}