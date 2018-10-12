import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

export default class AddMagazines extends Component {
    constructor(props) {
        super();
    }

    render() {
        return(
            <div style={style.body}>
                <h1>Magazine</h1>
                <form style={style.label} onSubmit={this.handleSubmit} method="POST">
                    <TextField
                        label="Title"
                        name="title"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Publisher"
                        name="publisher"
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
                        label="ISBN-10"
                        name="isbn_10"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="ISBN-13"
                        name="isbn_13"
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
    textField: {
        width: 300
    },
};