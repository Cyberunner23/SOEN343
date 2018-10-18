import React, { Component } from 'react';

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

            <div>
                <ul>
                    {this.state.musics.map((music, i) =>
                        <li key={i}>{music.title} {music.artist}
                            <button onClick={() => { this.removeMusics(music.title) }}> Delete</button>
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
                            Type:
        <input type="text" name="type" onChange={this.handleChange} />
                        </label>
                        <label>
                            Artist:
        <input type="text" name="artist" onChange={this.handleChange} />
                        </label>
                        <label>
                            Label:
        <input type="text" name="label" onChange={this.handleChange} />
                        </label>
                        <label>
                            Release Date:
        <input type="text" name="releaseDate" onChange={this.handleChange} />
                        </label>
                        <label>
                            ASIN:
        <input type="text" name="asin" onChange={this.handleChange} />
                        </label>
                        <button onClick={this.handleSubmit}>Submit</button>
                    </form>
                    {musicAddedMessage}
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
