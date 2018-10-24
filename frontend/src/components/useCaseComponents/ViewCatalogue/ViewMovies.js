import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

export default class ViewMovies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            director: '',
            producers: '',
            actors: '',
            language: '',
            subtitles: '',
            dubbed: '',
            releaseDate: '',
            runTime: '',
            app: props.app,
            movies: [],
            modifyMovie: false,
            movieModified: false,
            eidr: '',
            authToken: props.app.state.currentUser.authToken
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
                {movieModifiedMessage}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Director</TableCell>
                            <TableCell>Producers</TableCell>
                            <TableCell>Actors</TableCell>
                            <TableCell>Language</TableCell>
                            <TableCell>Subtitles</TableCell>
                            <TableCell>Dubbed</TableCell>
                            <TableCell>Release Date</TableCell>
                            <TableCell>Run Time</TableCell>
                            <TableCell>EIDR</TableCell>
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
                                    {movie.eidr}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMovie && this.state.eidr === movie.eidr) ?
                                        (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                                        (<Button color="primary" onClick={() => { this.modifyMovieState(movie) }}>Edit</Button>)}
                                    <Button color="secondary" onClick={() => { this.removeMovies(movie.eidr) }}> Delete</Button>
                                </TableCell>
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
            movieModifiedMessage: '',
            modifyMovie: true
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
}