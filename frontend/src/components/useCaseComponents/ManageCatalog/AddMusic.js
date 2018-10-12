import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

export default class AddMusic extends Component {
    constructor(props) {
        super();
    }

    render() {
        return(
            <div style={style.body}>
                <h1>Music</h1>
                <form style={style.label} onSubmit={this.handleSubmit} method="POST">
                    <TextField
                        label="Title"
                        name="title"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Type"
                        name="type"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Artist"
                        name="artist"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Label"
                        name="label"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="Released Date"
                        name="released_date"
                        margin="dense"
                        style={style.textField}
                        onChange={this.handleChange} />
                    <br/>
                    <TextField
                        label="ASIN"
                        name="asin"
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