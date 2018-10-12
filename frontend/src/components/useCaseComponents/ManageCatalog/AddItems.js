import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AddBooks from './AddBooks.js';
import AddMagazines from './AddMagazines.js';
import AddMusic from "./AddMusic";
import AddMovies from "./AddMovies";

export default class AddItem extends Component {
    constructor(props) {
        super();
        this.state = {
            app: props.app,
            showBook: false,
            showMagazine: false,
            showMusic: false,
            showMovie: false
        };
        this.showBook = this.showBook.bind(this);
        this.showMagazine = this.showMagazine.bind(this);
        this.showMusic = this.showMusic.bind(this);
        this.showMovie = this.showMovie.bind(this);
    }

    showBook() {
        this.setState({
            showBook: true,
            showMagazine: false,
            showMusic: false,
            showMovie: false
        })
    }

    showMagazine() {
        this.setState({
            showBook: false,
            showMagazine: true,
            showMusic: false,
            showMovie: false
        })
    }

    showMusic() {
        this.setState({
            showBook: false,
            showMagazine: false,
            showMusic: true,
            showMovie: false
        })
    }

    showMovie() {
        this.setState({
            showBook: false,
            showMagazine: false,
            showMusic: false,
            showMovie: true
        })
    }

    render() {
        var buttons;
        buttons = (
            <div className="mainapp">
                <Button color="primary" onClick={this.showBook}>Book</Button>
                <Button color="primary" onClick={this.showMagazine}>Magazine</Button>
                <Button color="primary" onClick={this.showMusic}>Music</Button>
                <Button color="primary" onClick={this.showMovie}>Movie</Button>
            </div>
        );

        return (
            <div className="UseCaseComponent">
                <h3>Pick an item to add: </h3>
                {buttons}
                {this.state.showBook ? <AddBooks/> : null}
                {this.state.showMagazine ? <AddMagazines/> : null}
                {this.state.showMusic ? <AddMusic/> : null}
                {this.state.showMovie ? <AddMovies/> : null}
                </div>
        );
    }
}