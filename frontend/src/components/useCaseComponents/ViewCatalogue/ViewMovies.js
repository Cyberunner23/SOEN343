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

export default class ViewMovies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '', director: '', producers: '', actors: '', language: '', subtitles: '', dubbed: '', releaseDate: '', runTime: '', eidr: '', numAvailable: '', numTotal: '',
            titleFilter: '', directorFilter: '', producersFilter: '', actorsFilter: '', languageFilter: '', subtitlesFilter: '', dubbedFilter: '',
            releaseDateFilter: '', runTimeFilter: '', eidrFilter: '', numAvailableFilter: '', numTotalFilter: '',
            app: props.app,
            movies: [],
            modifyMovie: false,
            movieModified: false,
            desc: false,
            authToken: props.app.state.currentUser.authToken,
            is_admin: props.is_admin
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        fetch('/api/catalogue/getMovies')
            .then(res => {
                res.json().then(
                    movies => this.setState({ movies: movies })
                )
            });
    }

    render() {
        var movieModifiedMessage;
        if (this.state.movieModified) {
            movieModifiedMessage = (
                <div>{this.state.movieModifiedMessage}</div>
            )
        }
        var content;
        content = (
            <div>
                <div style={style.format}>
                    <Typography>Filter By...</Typography>
                    <TextField style={style.field} label="title" name="titleFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="director" name="directorFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="producers" name="producersFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="actors" name="actorsFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="language" name="languageFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="subtitles" name="subtitlesFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="dubbed" name="dubbedFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="release date" name="releaseDateFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="run time" name="runTimeFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="EIDR" name="eidrFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="numAvailable" name="numAvailableFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="numTotal" name="numTotalFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <Button color="primary" onClick={() => { this.filter() }}>Search</Button>
                </div>
                {movieModifiedMessage}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('title')} direction={'desc'}>Title</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('director')} direction={'desc'}>Director</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('producers')} direction={'desc'}>Producers</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('actors')} direction={'desc'}>Actors</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('language')} direction={'desc'}>Language</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('subtitles')} direction={'desc'}>Subtitles</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('dubbed')} direction={'desc'}>Dubbed</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('releaseDate')} direction={'desc'}>Release Date</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('runTime')} direction={'desc'}>Run Time</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('eidr')} direction={'desc'}>EIDR</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('numAvailable')} direction={'desc'}>Copies Available</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('numTotal')} direction={'desc'}>Total Available</TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.movies.map((movie, i) =>
                            <TableRow key={i}>
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ? (<TextField
                                        name="title"
                                        margin="dense"
                                        defaultValue={movie.title}
                                        onChange={this.handleChange} />) : (movie.title)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ? (<TextField
                                        name="director"
                                        margin="dense"
                                        defaultValue={movie.director}
                                        onChange={this.handleChange} />) : (movie.director)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ? (<TextField
                                        name="producers"
                                        margin="dense"
                                        defaultValue={movie.producers}
                                        onChange={this.handleChange} />) : (movie.producers)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ? (<TextField
                                        name="actors"
                                        margin="dense"
                                        defaultValue={movie.actors}
                                        onChange={this.handleChange} />) : (movie.actors)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ? (<TextField
                                        name="language"
                                        margin="dense"
                                        defaultValue={movie.language}
                                        onChange={this.handleChange} />) : (movie.language)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ? (<TextField
                                        name="subtitles"
                                        margin="dense"
                                        defaultValue={movie.subtitles}
                                        onChange={this.handleChange} />) : (movie.subtitles)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ? (<TextField
                                        name="dubbed"
                                        margin="dense"
                                        defaultValue={movie.dubbed}
                                        onChange={this.handleChange} />) : (movie.dubbed)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ? (<TextField
                                        name="releaseDate"
                                        margin="dense"
                                        defaultValue={movie.releaseDate}
                                        onChange={this.handleChange} />) : (movie.releaseDate)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ? (<TextField
                                        name="runTime"
                                        margin="dense"
                                        defaultValue={movie.runTime}
                                        onChange={this.handleChange} />) : (movie.runTime)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ? (<TextField
                                        name="numAvailable"
                                        margin="dense"
                                        defaultValue={movie.numAvailable}
                                        onChange={this.handleChange} />) : (movie.numAvailable)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyBook && this.state.eidr === movie.eidr) ? (<TextField
                                        name="numTotal"
                                        margin="dense"
                                        defaultValue={movie.numTotal}
                                        onChange={this.handleChange} />) : (movie.numTotal)}
                                </TableCell>
                                <TableCell>
                                    {movie.eidr}
                                </TableCell>
                                {this.state.is_admin === 1 &&
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ?
                                        (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                                        (<Button color="primary" onClick={() => { this.modifyMovieState(movie) }}>Edit</Button>)}
                                    <Button color="secondary" onClick={() => { this.removeMovies(movie.eidr) }}> Delete</Button>
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
            <div className='ViewMoviesComponent UseCaseComponent'>
                <h2>Movies</h2>
                {content}
            </div>
        )
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, movieModified: false, movieModifiedMessage: '' });
    }

    modifyMovieState(movie) {
        this.setState({
            title: movie.title,
            director: movie.director,
            producers: movie.producers,
            actors: movie.actors,
            language: movie.language,
            subtitles: movie.subtitles,
            dubbed: movie.dubbed,
            releaseDate: movie.releaseDate,
            runTime: movie.runTime,
            eidr: movie.eidr,
            numAvailable: movie.numAvailable,
            movieModifiedMessage: '',
            modifyMovie: true
        });
    }

    sort(field) {
        if (field === ('runtime' || 'eidr')) {
            sorter.intSort(this.state.movies, field, this.state.desc);
        }
        else {
            sorter.stringSort(this.state.movies, field, this.state.desc);
        }
        this.setState({movies: this.state.movies, desc: !this.state.desc});
    }

    filter() {
        let title = this.state.titleFilter;
        let director = this.state.directorFilter;
        let producers = this.state.producersFilter;
        let actors = this.state.actorsFilter;
        let language = this.state.languageFilter;
        let subtitles = this.state.subtitlesFilter;
        let dubbed = this.state.dubbedFilter;
        let releaseDate = this.state.releaseDateFilter;
        let runTime = this.state.runTimeFilter;
        let eidr = this.state.eidrFilter;
        let numAvailable = this.state.numAvailableFilter;
		let numTotal = this.state.numTotalFilter;
        let jsonObject = {title, director, producers, actors, language, subtitles, dubbed, releaseDate, runTime, eidr, numAvailable, numTotal};

        Object.keys(jsonObject).forEach((key) => (jsonObject[key] === "") && delete jsonObject[key]);

        //convert json to url params
        let url = Object.keys(jsonObject).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(jsonObject[k])
        }).join('&');

        fetch('/api/catalogue/getMovies?' + url, {
            method: 'GET'
        }).then(res => {
            res.json().then(
                movies => this.setState({ movies: movies })
            )
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.modifyMovie(this.state)
            .then((movie) => {
                if (movie !== null) {
                    console.log('Movie modified successfully');
                    this.setState({ modifyMovie: false, movieModified: true, movieModifiedMessage: 'Movie ' + movie.title + ' modified' })
                } else {
                    console.log('Modification could not be completed');
                    this.setState({ movieModified: true, movieModifiedMessage: 'Modification could not be completed' })
                }
            }).then(() => {
                this.componentDidMount();
            })
    }

    async removeMovies(eidr) {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/removeMovies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eidr: eidr, authToken: this.state.authToken})
            }).then((res => {
                if (res.status === 200) {
                    console.log("deleted movie");
                    this.setState({ modifyMovie: false, movieModified: true, movieModifiedMessage: 'Movie removed successfully' })
                } else {
                    console.log(res)
                    this.setState({ movieModified: true, movieModifiedMessage: 'Movie could not be removed' })
                }
            })).then(() => { this.componentDidMount(); });
        })
    }

    async modifyMovie(props) {
        let title = props.title;
        let director = props.director;
        let producers = props.producers;
        let actors = props.actors;
        let language = props.language;
        let subtitles = props.subtitles;
        let dubbed = props.dubbed;
        let releaseDate = props.releaseDate;
        let runTime = props.runTime;
        let eidr = props.eidr;
        let numAvailable = props.numAvailable;
		let numTotal = props.numTotal;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/modifyMovie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, director, producers, actors, language, subtitles, dubbed, releaseDate, runTime, eidr, numAvailable, numTotal, authToken: this.state.authToken})
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((movie) => {
                        resolve(movie);
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