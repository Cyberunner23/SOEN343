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
                    <TextField style={style.field} label="transaction id" name="transactionIdFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="user id" name="userIdFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="transaction type" name="transactionTypeFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="transaction time" name="transactionTimeFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="returned state" name="isReturnedFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="media id" name="mediaIdFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="media type" name="mediaTypeFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="due date" name="dueDateFilter" margin="dense" onChange={this.handleChange} />
                    <br /><Button color="primary" onClick={() => { this.filter() }}>Search</Button>
                </div>
                <Table style={style.format}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('transactionId')}>TransactionId</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('userId')}>UserId</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('transactionType')}>TransactionType</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('transactionTime')}>TransactionTime</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('isReturned')}>IsReturned</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('mediaId')}>MediaId</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('mediaType')}>MediaType</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('dueDate')}>DueDate</TableSortLabel>
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
                                <TableCell>
                                    {item.dueDate}
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
        let dueDate = this.state.dueDate;
        let jsonObject = {transactionId, userId, transactionType, transactionTime, isReturned, mediaId, mediaType, dueDate};

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