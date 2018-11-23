import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const sorter = require('../../helper_classes/Sorter.js').getInstance();

export default class Loans extends Component {
        
    constructor(props) {
        super();
        this.state = {
                transactionIdFilter: '', userIdFilter: '', transactionTypeFilter: '', transactionTimeFilter: '', isReturnedFilter: '', mediaIdFilter: '', mediaTypeFilter: '',
                app: props.app,
                desc: false,
                items: [],
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidMount() {
        fetch('/api/transaction/getTransactions', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({authToken: this.state.app.state.currentUser.authToken}),
        })
        .then(res => {
            if(res.status === 200) {
                res.json().then(
                    items => {
                        this.setState({items: items})
                    }
                )
            }
            else {
                this.setState({items: []})
            }
        })
    }
    
    render() {
        
        var content;
        content = (
            <div>
                <div style={style.format}>
                    <Typography>Filter By...</Typography>
                    <TextField style={style.field} label="transaction id" name="transactionIdFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="user id" name="userIdFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="transaction type" name="transactionTypeFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="transaction time" name="transactionTimeFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="returned state" name="isReturnedFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="media id" name="mediaIdFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="media type" name="mediaTypeFilter" margin="dense" onChange={this.handleChange} />
                    <br /><Button color="primary" onClick={() => { this.filter() }}>Search</Button>
                </div>
                <Table style={style.format}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('TransactionId')}>TransactionId</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('UserId')}>UserId</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('TransactionType')}>TransactionType</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('TransactionTime')}>TransactionTime</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('IsReturned')}>IsReturned</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('MediaId')}>MediaId</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('MediaType')}>MediaType</TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.items.map((item, i) =>
                                <TableRow key={i}>
                                <TableCell>
                                    {item.transactionId}
                                </TableCell>
                                <TableCell>
                                    {item.userId}
                                </TableCell>
                                <TableCell>
                                    {item.transactionType}
                                </TableCell>
                                <TableCell>
                                    {item.transactionTime}
                                </TableCell>
                                <TableCell>
                                    {item.isReturned}
                                </TableCell>
                                <TableCell>
                                    {item.mediaId}
                                </TableCell>
                                <TableCell>
                                    {item.mediaType}
                                </TableCell>
                            </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>
        );

        return (<div className='ViewLoansComponent UseCaseComponent'><h2>Loans</h2>{content}</div>);
    }

    sort(field) {
        let currentState = this.state.desc;

        if(this.state.lastSortField !== field) {
            currentState = false;
        }
        else {
            currentState = !currentState;
        }
        sorter.stringSort(this.state.items, field, currentState);
        this.setState({items: this.state.items, desc: currentState, lastSortField: field});
    }
    
    filter() {
        let transactionId = this.state.transactionIdFilter;
        let userId = this.state.userIdFilter;
        let transactionType = this.state.transactionTypeFilter;
        let transactionTime = this.state.transactionTimeFilter;
        let isReturned = this.state.isReturnedFilter;
        let mediaId = this.state.mediaIdFilter;
        let mediaType = this.state.mediaTypeFilter;
        let jsonObject = {transactionId, userId, transactionType, transactionTime, isReturned, mediaId, mediaType};

        Object.keys(jsonObject).forEach((key) => (jsonObject[key] === "") && delete jsonObject[key]);

        fetch('/api/transaction/getTransactions', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({filters: jsonObject, authToken: this.state.app.state.currentUser.authToken}),
        })
            .then(res => {
                if(res.status === 200) {
                    res.json().then(
                        items => {
                            this.setState({items: items})
                        }
                    )
                }
                else {
                    this.setState({items: []})
                }
            })
    }
    
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value});
    }
    
}

const style = {
    format: {
        marginTop: 25,
        marginBottom: 25
    },
    field: {
        paddingRight: 10
    }
}