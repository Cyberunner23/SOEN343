import React, { Component } from 'react';
import './tab.css';

class Tab extends Component {

    constructor(props) {
        super();
        this.state = {
            text: props.text,
            color: props.color,
            view: props.view,
            callBacks: props.callBacks
        }
    }

    render() {
        var style = {
            'background-color': this.state.color
        }
        return (
            <button className = 'tab' style = {style} onClick = {() => this.state.callBacks.setView(this.state.view)}>
                {this.state.text}
            </button>
        );
    }
}

export default Tab;
