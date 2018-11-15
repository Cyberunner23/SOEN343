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
                user: '', title: '', type: '', dateLoaned: '', dateDue: '',
                userFilter: '', titleFilter: '', typeFilter: '', dateLoanedFilter: '', dateDueFilter: '',
                app: props.app,
                desc: false,
                items: [],
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidMount() {
        fetch('/api/catalogue/getBooks', { // TODO : fill in api fetch
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({authToken: this.state.app.state.currentUser.authToken})
        })
        .then(res => {
            if(res.status === 200) {
                res.json().then(
                    items => this.setState({items: items})
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
                    <TextField style={style.field} label="user" name="userFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="title" name="titleFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="type" name="typeFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="date loaned" name="dateLoanedFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="date due" name="dateDueFilter" margin="dense" onChange={this.handleChange} />
                    <br /><Button color="primary" onClick={() => { this.filter() }}>Search</Button>
                </div>
                <Table style={style.format}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('user')} direction={'desc'}>User</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('title')} direction={'desc'}>Title</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('type')} direction={'desc'}>Type</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('dateLoaned')} direction={'desc'}>Date Loaned</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('dateDue')} direction={'desc'}>Date Due</TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.items.map((item, i) =>
                            <TableRow key={i}>
                                <TableCell>
                                    {item.user}
                                </TableCell>
                                <TableCell>
                                    {item.title}
                                </TableCell>
                                <TableCell>
                                    {item.type}
                                </TableCell>
                                <TableCell>
                                    {item.dateLoaned}
                                </TableCell>
                                <TableCell>
                                    {item.dateDue}
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
        sorter.stringSort(this.state.items, field, this.state.desc);
        this.setState({books: this.state.items, desc: !this.state.desc});
    }
    
    filter() {
        let user = this.state.userFilter;
        let title = this.state.titleFilter;
        let type = this.state.typeFilter;
        let dateLoaned = this.state.dateLoanedFilter;
        let dateDue = this.state.dateDueFilter;
        let jsonObject = {user, title, type, dateLoaned, dateDue};

        Object.keys(jsonObject).forEach((key) => (jsonObject[key] === "") && delete jsonObject[key]);

        // convert json to url params
        let url = Object.keys(jsonObject).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(jsonObject[k])
        }).join('&');

        fetch('/api/catalogue/getBooks?' + url, { // TODO: update api fetch
            method: 'GET'
        }).then(res => {
            res.json().then(
                items => this.setState({ items: items })
            )
        });
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