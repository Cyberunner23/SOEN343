import React, { Component } from 'react';
import './clients.css';

class Clients extends Component {
    constructor() {
        super();
        this.state = {
            clients: []
        }
    }

    componentDidMount() {
        fetch('/api/clients')
            .then(res => res.json())
            .then(clients => this.setState({ clients }, () =>
                console.log('Clients fetched..', clients)));
    }

    render() {
        return (
            //Currently this only returns the team members, as a test of the framework.
            <div>
                <h2>Team:</h2>
                <ul>
                    {this.state.clients.map(client =>
                        <li key={client.id}>{client.first_name} {client.last_name} </li>
                    )}
                </ul>
            </div>
        );
    }
}

export default Clients;
