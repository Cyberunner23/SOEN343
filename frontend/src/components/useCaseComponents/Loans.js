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
                prevState: false,
                desc: false,
                items: [],
                catalogueItems:[],
                currentItem:[],
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
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

    componentDidUpdate() {
        if(!this.state.prevState){   
            var item = [];
            item = this.state.catalogueItems; 
            for(var i = 0; i < this.state.items.length; i++){
                console.log(i);
                switch(this.state.items[i].mediaType){
                    case "book":
                        var isbn13 = this.state.items[i].mediaId;
                        fetch('/api/catalogue/getBooks?' + "isbn13=" + isbn13, {
                            method: 'GET'
                        }).then(res => {
                            console.log(res);
                            res.json().then(
                                book => {
                                    console.log(isbn13);
                                    item[isbn13] = book;
                                    console.log(item);
                                }
                            )
                        });
                        break;
                    case "music":
                        var asin = this.state.items[i].mediaId;
                        fetch('/api/catalogue/getMusics?' + "asin=" + asin, {
                            method: 'GET'
                        }).then(res => {
                            console.log(res);
                            res.json().then(
                                music => {
                                    console.log(asin);
                                    item[asin] = music;
                                    console.log(item);
                                }
                            )
                        });
                        break;
                    case "magazine":
                        var isbn13 = this.state.items[i].mediaId;
                        fetch('/api/catalogue/getMagazines?' + "isbn13=" + isbn13, {
                            method: 'GET'
                        }).then(res => {
                            console.log(res);
                            res.json().then(
                                magazine => {
                                    console.log(isbn13);
                                    item[isbn13] = magazine;
                                    console.log(item);
                                }
                            )
                        });
                        break;
                    case "movie":
                        var eidr = this.state.items[i].mediaId;
                        fetch('/api/catalogue/getMovies?' + "eidr=" + eidr, {
                            method: 'GET'
                        }).then(res => {
                            console.log(res);
                            res.json().then(
                                movie => {
                                    console.log(eidr);
                                    item[eidr] = movie;
                                    console.log(item);
                                }
                            )
                        });
                        break;
                    default:
                        break;
                }
            }
            this.setState({ catalogueItems: item });
            this.setState({ prevState: true });
        }
        console.log(this.state.catalogueItems);
        //console.log(this.state.catalogueItems);
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
                                <TableSortLabel>TransactionId</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>UserId</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>TransactionType</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>TransactionTime</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>IsReturned</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>MediaId</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>MediaType</TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.items.map((item, i) =>
                                <TableRow key={i}>
                                <TableCell>
                                    { this.getItem(item.mediaId) }
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

        fetch('/api/transaction/getTransactions?' + url, {
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

    getTitle(id) {
        return this.state.catalogueItems[id][0].title;
        // this.getItem(id, type);
        // var item = JSON.parse(JSON.stringify(this.state.currentItem));
        // if(!(item === undefined || item.length == 0)) console.log("Title:" + this.state.currentItem[0].title);
        // console.log(this.state.currentItem);
    }

    getItem(id, type) {
        var item = this.state.catalogueItems;
        console.log('ID ' + id + ' and type ' + type);
        console.log(this.state.catalogueItems[id][0].title);
        return this.state.catalogueItems[id][0].title;
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