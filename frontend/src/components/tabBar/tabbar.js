import React, { Component } from 'react';
import './tabbar.css';

class TabBar extends Component {

    constructor(props) {
        super();
        this.state = {
            tabs: props.tabs,
            color: props.color
        }
    }

    render() {
        const style = {'background-color': this.state.color}
        return (
            <div className = 'tabbar' style = {style}>
                {this.state.tabs.map(tab =>
                    tab
                )}
            </div>
        );
    }
}

export default TabBar;
