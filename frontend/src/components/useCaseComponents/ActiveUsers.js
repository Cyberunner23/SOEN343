import React, { Component } from 'react';
import './ActiveUsers.css';

export default class ActiveUsers extends Component {

    constructor(props) {
        super();
        this.state = {
            app: props.app,
            activeUsers: [],
            serverReturnedAnError: false
        }
    }

    componentDidMount() {
        fetch('/api/activeUsers')
        .then(res => {
            if (res.status === 200) {
                res.json().then(
                    users => this.setState({activeUsers: users, serverReturnedAnError: false})
                )
            }
            else {
                this.setState({activeUsers: [], serverReturnedAnError: true});
            }
        });
    }

    render() {
        var content;
        if (!this.state.serverReturnedAnError) {
            content = (
                <ul>
                    {this.state.activeUsers.map(user =>
                        <li key={user.id}>{user.first_name} {user.last_name}</li>
                    )}
                </ul>
            );
        }
        else {
            content = 'Oops! An error occured. See console for details.';
        }

        return (
            <div className = 'ActiveUsersComponent UseCaseComponent'>
                <h2>Active Users</h2>
                {content}
            </div>
        );
    }
}