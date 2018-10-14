import React, { Component } from 'react';

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
            movieAdded: false
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

            <div>
                <ul>
                    {this.state.movies.map((movie, i) =>
                        <li key={i}>{movie.title} {movie.director}
                            <button onClick={() => { this.removeMovie(movie.title) }}> Delete</button>
                        </li>
                    )}
                </ul>

                <div className='UseCaseComponent'>
                    <form onSubmit={this.handleSubmit} method="POST">
                        <label>
                            Title:
        <input type="text" name="title" onChange={this.handleChange} />
                        </label>
                        <label>
                            Director:
        <input type="text" name="director" onChange={this.handleChange} />
                        </label>
                        <label>
                            Producers:
        <input type="text" name="producers" onChange={this.handleChange} />
                        </label>
                        <label>
                            Actors:
        <input type="text" name="actors" onChange={this.handleChange} />
                        </label>
                        <label>
                            Language:
        <input type="text" name="language" onChange={this.handleChange} />
                        </label>
                        <label>
                            Subtitles:
        <input type="text" name="subtitles" onChange={this.handleChange} />
                        </label>
                        <label>
                            Dubbed:
        <input type="text" name="dubbed" onChange={this.handleChange} />
                        </label>
                        <label>
                            Release Date:
        <input type="text" name="releaseDate" onChange={this.handleChange} />
                        </label>
                        <label>
                            Run Time:
        <input type="text" name="runTime" onChange={this.handleChange} />
                        </label>
                        <button onClick={this.handleSubmit}>Submit</button>
                    </form>
                    {movieAddedMessage}
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

    async removeMovie(title) {
        console.log('front end: ' + title)

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/removeMovie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title })
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
        let releaseDate = props.releaseDate
        let runTime = props.runTime

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addMovie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, director, producers, actors, language, subtitles, dubbed, releaseDate, runTime })
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
