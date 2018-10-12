import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

export default class AddMovies extends Component {
    constructor(props) {
        super();
    }

    render() {
        return(
            <div style={style.body}>
                <h1>Movie</h1>
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
                        name="release_date"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Run Time"
                        name="run_time"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <Input type="submit" style={style.label}>
                        Register
                    </Input>
                </form>
            </div>
        );
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