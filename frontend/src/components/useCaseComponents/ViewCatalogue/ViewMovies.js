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
            movieAdded: false,
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
        var movieAddedMessage;
        if (this.state.movieAdded) {
            movieAddedMessage = (
                <div>{this.state.movieAddedMessage}</div>
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
                            label="Director"
                            name="director"
                            margin="dense"
                            value={this.state.director}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Producers"
                            name="producers"
                            margin="dense"
                            value={this.state.producers}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Actors"
                            name="actors"
                            margin="dense"
                            value={this.state.actors}
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
                            label="Subtitles"
                            name="subtitles"
                            margin="dense"
                            value={this.state.subtitles}
                            style={style.minTextField}
                            onChange={this.handleChange} />
                        <TextField
                            label="Dubbed"
                            name="dubbed"
                            margin="dense"
                            value={this.state.dubbed}
                            style={style.margin}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Release Date"
                            name="releaseDate"
                            margin="dense"
                            value={this.state.releaseDate}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="Run Time"
                            name="runTime"
                            margin="dense"
                            value={this.state.runTime}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <TextField
                            label="EIDR"
                            name="eidr"
                            margin="dense"
                            value={this.state.eidr}
                            style={style.textField}
                            onChange={this.handleChange} />
                        <br/>
                        <Input type="submit" style={style.label}>
                            Register
                        </Input>
                    </form>
                    {movieAddedMessage}
                </div>
                <div className="flex">
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
                                        {movie.title}
                                    </TableCell>
                                    <TableCell>
                                        {movie.director}
                                    </TableCell>
                                    <TableCell>
                                        {movie.producers}
                                    </TableCell>
                                    <TableCell>
                                        {movie.actors}
                                    </TableCell>
                                    <TableCell>
                                        {movie.language}
                                    </TableCell>
                                    <TableCell>
                                        {movie.subtitles}
                                    </TableCell>
                                    <TableCell>
                                        {movie.dubbed}
                                    </TableCell>
                                    <TableCell>
                                        {movie.releaseDate}
                                    </TableCell>
                                    <TableCell>
                                        {movie.runTime}
                                    </TableCell>
                                    <TableCell>
                                        {movie.eidr}
                                    </TableCell>
                                    <TableCell>
                                        <Button color="primary" onClick={() => { this.modifyMovie(movie) }}>Edit</Button>
                                        <Button color="secondary" onClick={() => { this.removeMovies(movie.eidr) }}> Delete</Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
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
        this.setState({ [e.target.name]: e.target.value, movieAdded: false });
    }

    modifyMovie(movie) {
        this.setState({
            title: movie.title,
            director: movie.director,
            producers: movie.producers,
            actors: movie.actors,
            language: movie.language,
            subtitles: movie.subtitles,
            dubbed: movie.dubbed,
            releaseDate: movie.releaseDate,
            runTime: movie.runTime
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.addMovie(this.state)
            .then((movie) => {
                if (movie !== null) {
                    console.log('Movie added successfully');
                    this.setState({ movieAdded: true, movieAddedMessage: 'New movie ' + movie.title + ' added' })
                } else {
                    console.log('Movie already added');
                    this.setState({ movieAdded: true, movieAddedMessage: 'Movie already added' })
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
                } else {
                    console.log(res)
                }
            })).then(() => { this.componentDidMount(); });
        })
    }

    async addMovie(props) {
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
            fetch('/api/catalogue/addMovie', {
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

const style = {
    body: {
        margin: 30
    },
    margin: {
        marginLeft: 10,
        width: 145
    },
    minTextField: {
        width: 145
    },
    textField: {
        width: 300
    },
};