import React, { Component } from 'react';
import './activeUsersComponent.css';

class ActiveUsersComponent extends Component {

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
                        <li key={user.id}>{user.FirstName} {user.LastName} </li>
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

export default ActiveUsersComponent;