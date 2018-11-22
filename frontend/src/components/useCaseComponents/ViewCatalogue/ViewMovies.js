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
            title: '', director: '', producers: '', actors: '', language: '', subtitles: '', dubbed: '', releaseDate: '', runTime: '', eidr: '',
            titleFilter: '', directorFilter: '', producersFilter: '', actorsFilter: '', languageFilter: '', subtitlesFilter: '', dubbedFilter: '',
            releaseDateFilter: '', runTimeFilter: '', eidrFilter: '',
            app: props.app,
            movies: [],
            movieItemBool: false,
            movieItem: [],
            modifyMovie: false,
            movieModified: false,
            desc: false,
            lastSortField: '',
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
                <div style={style.producers}>
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
                    <Button color="primary" onClick={() => { this.filter() }}>Search</Button>
                </div>
                {movieModifiedMessage}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('title')}>Title</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('director')}>Director</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('eidr')}>EIDR</TableSortLabel>
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
                                    {movie.eidr}
                                </TableCell>
                                {this.state.is_admin === 1 &&
                                <TableCell>
                                {(this.state.modifyMovie && this.state.eidr === movie.eidr) ?
                                (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                                (<Button color="primary" onClick={() => { this.modifyMovieState(movie) }}>Edit</Button>)}
                                <Button color="secondary" onClick={() => { this.removeMovies(movie.eidr) }}>Delete</Button>
                            </TableCell>}
                            {this.state.is_admin === 0 &&
                            <TableCell>
                                <Button color="primary" onClick={() => { this.detailedMovie(movie, true) }}>View Details</Button>
                                <Button variant="contained" color="secondary" onClick={() => { this.addMovieToCart(movie.eidr) }} disabled>Add to Cart</Button>
                            </TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    var itemDetails;
    itemDetails = (
        <div className="fixed" style={style.body} key={this.state.movieItem.eidr}>
            <Button color="primary" onClick={() => { this.detailedMovie([], false) }}>Back to movies View</Button>
            <br/>
            <TextField
                    label="Title"
                    name="title"
                    margin="normal"
                    defaultValue= {(this.state.movieItem.title)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMovie && this.state.eidr === this.state.movieItem.eidr) ? false : true} />
                <br/>
                <TextField
                    label="Director"
                    name="director"
                    margin="normal"
                    defaultValue= {(this.state.movieItem.director)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMovie && this.state.eidr === this.state.movieItem.eidr) ? false : true} />
                <br/>
                <TextField
                    label="Producers"
                    name="producers"
                    margin="normal"
                    defaultValue= {(this.state.movieItem.producers)}
                    style={style.producers}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMovie && this.state.eidr === this.state.movieItem.eidr) ? false : true} />
                <br/>
                <TextField
                    label="Actors"
                    name="actors"
                    margin="normal"
                    defaultValue= {(this.state.movieItem.actors)}
                    style={style.page}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMovie && this.state.eidr === this.state.movieItem.eidr) ? false : true} />
                <br/>
                <TextField
                    label="Language"
                    name="language"
                    margin="normal"
                    defaultValue= {(this.state.movieItem.language)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMovie && this.state.eidr === this.state.movieItem.eidr) ? false : true} />
                <br/>
                <TextField
                    label="Subtitles"
                    name="subtitles"
                    margin="normal"
                    defaultValue= {(this.state.movieItem.subtitles)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMovie && this.state.eidr === this.state.movieItem.eidr) ? false : true} />
                <br/>
                <TextField
                    label="Dubbed"
                    name="dubbed"
                    margin="normal"
                    defaultValue= {(this.state.movieItem.dubbed)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMovie && this.state.eidr === this.state.movieItem.eidr) ? false : true} />
                <br/>
                <TextField
                    label="Release Date"
                    name="releaseDate"
                    margin="normal"
                    defaultValue= {(this.state.movieItem.releaseDate)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMovie && this.state.eidr === this.state.movieItem.eidr) ? false : true} />
                <br/>
                <TextField
                    label="Run Time"
                    name="runTime"
                    margin="normal"
                    defaultValue= {(this.state.movieItem.runTime)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMovie && this.state.eidr === this.state.movieItem.eidr) ? false : true} />
                <br/>
                <TextField
                    label="EIDR"
                    name="eidr"
                    margin="normal"
                    defaultValue= {(this.state.movieItem.eidr)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled={(this.state.modifyMovie && this.state.eidr === this.state.movieItem.eidr) ? false : true} />
                <br/>
                {this.state.is_admin === 0 &&
                <p>
                    <Button variant="contained" color="secondary" onClick={() => { this.sequenceMovie(this.state.movieItem, false) }}>Previous</Button>
                    <Button variant="contained" color="secondary" onClick={() => { this.addMovieToCart(this.state.movieItem.eidr) }} disabled>Add to Cart</Button>
                    <Button variant="contained" color="secondary" onClick={() => { this.sequenceMovie(this.state.movieItem, true) }}>Next</Button>
                </p>}
                {this.state.is_admin === 1 &&
                <p>
                {(this.state.modifyMovie && this.state.eidr === this.state.movieItem.eidr) ?
                    (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                    (<Button color="primary" onClick={() => { this.modifyMovieState(this.state.movieItem) }}>Edit</Button>)}
                    <Button color="secondary" onClick={() => { this.removemovies(this.state.movieItem.eidr) }}>Delete</Button>
                </p>}
        </div>
    );

        return (
            <div className='ViewMoviesComponent UseCaseComponent'>
                <h2>Movies</h2>
                {this.state.movieItemBool ? itemDetails : content}
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
            movieModifiedMessage: '',
            movieItem: movie,
            movieItemBool: true,
            modifyMovie: true
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

        if (field === ('eidr')) {
            sorter.intSort(this.state.movies, field, currentState);
        }
        else {
            sorter.stringSort(this.state.movies, field, currentState);
        }
        this.setState({movies: this.state.movies, desc: currentState, lastSortField: field});
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
        let jsonObject = {title, director, producers, actors, language, subtitles, dubbed, releaseDate, runTime, eidr};

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

    async addMovieToCart(eidr) {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addToCart', {
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

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/modifyMovie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, director, producers, actors, language, subtitles, dubbed, releaseDate, runTime, eidr, authToken: this.state.authToken})
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
    
    detailedMovie(movie, bool) {
        this.setState({
            movieItem: movie,
            movieItemBool: bool
        });
    }

    async sequenceMovie(movie, bool){
        var index =  this.state.movies.indexOf(movie);
        if(bool) index = ((this.state.movies.length - 1) == index ? index : ++index);
        else index = (index == 0 ? 0 : --index);
        this.setState({
            movieItem: this.state.movies[index]
        });
    }

    async addMovieToCart(props){
        let eidr = props.eidr;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addToCart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({eidr , authToken: this.state.authToken})
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
    producers: {
        marginTop: 25,
        marginBottom: 25
    },
    field: {
        paddingRight: 10
    }
}