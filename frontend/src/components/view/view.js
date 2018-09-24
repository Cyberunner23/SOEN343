import React, { Component } from 'react';
import './view.css';

class View extends Component {

    constructor(props) {
        super();
        this.state = {
            color: props.color
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps)
    }

    render() {
        var style = {
            'background-color': this.state.color
        }
        return (
            <div className = 'view' style = {style}>
                <div id = 'padding-top'/>
                {this.state.content}
            </div>
        );
    }
}

export default View;
