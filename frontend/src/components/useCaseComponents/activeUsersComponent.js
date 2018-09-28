import React, { Component } from 'react';
import './activeUsersComponent.css';

class ActiveUsersComponent extends Component {

    constructor(props) {
        super();
        this.state = {
            color: props.color,
            app: props.app,
            activeUsers: []
        }
    }

    componentDidMount() {
        fetch('/api/activeUsers')
            .then(res => res.json())
            .then(activeUsers => this.setState({ activeUsers }, () =>
                console.log('Active users fetched..', activeUsers)));
    }

    render() {
        var style = {
            'background-color' : this.state.color
        }
        return (
            <div className = 'ActiveUsersComponent UseCaseComponent' style = {style}>
                <h2>Active Users</h2>
                <ul>
                    {this.state.activeUsers.map(user =>
                        <li key={user.id}>{user.first_name} {user.last_name} </li>
                    )}
                </ul>
            </div>
        );
    }
}

export default ActiveUsersComponent;