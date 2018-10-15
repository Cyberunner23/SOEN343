import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import './ActiveUsers.css';

export default class ActiveUsers extends Component {

    constructor(props) {
        super();
        this.state = {
            app: props.app,
            activeUsers: [],
            serverReturnedAnError: false
        };
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        fetch('/api/users/activeUsers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({authToken: this.state.app.state.currentUser.authToken})
        })
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.activeUsers.map(user =>
                        <TableRow key={user.email}>
                            <TableCell>{user.first_name} {user.last_name}</TableCell>
                            <TableCell>{user.timestamp}</TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            );
        }
        else {
            content = 'Oops! An error occured. See console for details.';
        }

        return (
            <div>
                <h2>Active Users</h2>
                <Button variant="outlined" color="primary" onClick = {this.componentDidMount}>Refresh</Button>
                <Paper className = 'ActiveUsersComponent UseCaseComponent'>
                    {content}
                </Paper>
            </div>

        );
    }
}