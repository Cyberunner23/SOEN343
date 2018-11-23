import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

export default class AddMovie extends Component {

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
            eidr: '',
            numAvailable: '',
			numTotal: '',
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
                        label="Director"
                        name="director"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Producers"
                        name="producers"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Actors"
                        name="actors"
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
                        label="Subtitles"
                        name="subtitles"
                        margin="dense"
                        style={style.minTextField}
                        onChange={this.handleChange} />
                    <TextField
                        label="Dubbed"
                        name="dubbed"
                        margin="dense"
                        style={style.margin}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Release Date"
                        name="releaseDate"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Run Time"
                        name="runTime"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="EIDR"
                        name="eidr"
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
                        Register
                    </Input>
                </form>
                {movieAddedMessage}
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
        let numAvailable = props.numAvailable;
		let numTotal= props.numTotal;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addMovie', {
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
    page: {
        marginLeft: 10,
        width: 90
    },
};