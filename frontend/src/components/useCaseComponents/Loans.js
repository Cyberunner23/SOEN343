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
                catalogueItems:[],
                detailedItem: [],
                detailedItemBool: false,
                update: false
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        // this.componentDidUpdate = this.componentDidUpdate.bind(this);
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
                        this.setState({items: items});
                    }
                )
            }
            else {
                this.setState({items: []})
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("componentDidUpdate" + this.state.catalogueItems);
        if(prevState.items !== this.state.items){   
            var item = [];
            item = this.state.catalogueItems; 
            for(var i = 0; i < this.state.items.length; i++){
                switch(this.state.items[i].mediaType){
                    case "book":
                        var isbn13 = this.state.items[i].mediaId;
                        fetch('/api/catalogue/getBooks?' + "isbn13=" + isbn13, {
                            method: 'GET'
                        }).then(res => {
                            console.log("componentDidUpdate" + res);
                            res.json().then(
                                book => {
                                    console.log("componentDidUpdate" + isbn13);
                                    item[isbn13] = book;
                                }
                            )
                        });
                        break;
                    case "music":
                        var asin = this.state.items[i].mediaId;
                        fetch('/api/catalogue/getMusics?' + "asin=" + asin, {
                            method: 'GET'
                        }).then(res => {
                            console.log("componentDidUpdate" + res);
                            res.json().then(
                                music => {
                                    console.log("componentDidUpdate" + asin);
                                    item[asin] = music;
                                }
                            )
                        });
                        break;
                    case "magazine":
                        var isbn13 = this.state.items[i].mediaId;
                        fetch('/api/catalogue/getMagazines?' + "isbn13=" + isbn13, {
                            method: 'GET'
                        }).then(res => {
                            console.log("componentDidUpdate" + res);
                            res.json().then(
                                magazine => {
                                    console.log("componentDidUpdate" + isbn13);
                                    item[isbn13] = magazine;
                                }
                            )
                        });
                        break;
                    case "movie":
                        var eidr = this.state.items[i].mediaId;
                        fetch('/api/catalogue/getMovies?' + "eidr=" + eidr, {
                            method: 'GET'
                        }).then(res => {
                            console.log("componentDidUpdate" + res);
                            res.json().then(
                                movie => {
                                    console.log("componentDidUpdate" + eidr);
                                    item[eidr] = movie;
                                }
                            )
                        });
                        break;
                    default:
                        break;
                }
            }
            this.setState({ 
                catalogueItems: item,
                update: true, 
            });
            this.forceUpdate()
        }
        console.log(this.state.catalogueItems);
    }
    
    render() {

        var itemDetail;

        itemDetail = this.state.detailedItem;

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
                            <TableCell></TableCell>
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
                                <TableCell>
                                    {item.dueDate}
                                </TableCell>
                                <TableCell>
                                    {item.dueDate}
                                </TableCell>
                                <TableCell><Button variant="contained" color="secondary" onClick={() => { this.getItem(item.mediaId, item.mediaType) }}>View Details</Button></TableCell>
                            </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>
        );

        return (
        <div className='ViewLoansComponent UseCaseComponent'>
            <h2>Loans</h2>
            {this.state.detailedItemBool ? itemDetail : content}
        </div>);
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
        const items = this.state.catalogueItems;
        console.log(items[id][0].title);
        return items;
        // console.log(this.state.catalogueItems);
        // console.log(this.state.catalogueItems[id][0].title);
        // // this.getItem(id, type);
        // // var item = JSON.parse(JSON.stringify(this.state.currentItem));
        // // if(!(item === undefined || item.length == 0)) console.log("Title:" + this.state.currentItem[0].title);
        // // console.log(this.state.currentItem);
    }

    getItem(id, type) {
        var itemDetail;
        switch(type) {
            case 'book':
            itemDetail = (
                <div className="fixed" style={style.body} key={this.state.catalogueItems[id][0].isbn13}>
                    <Button color="primary" onClick={() => { this.setState({detailedItemBool: false}) }}>Back to Books View</Button>
                    <br/>
                    <TextField
                            label="Title"
                            name="title"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].title)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Author"
                            name="author"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].author)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Format"
                            name="format"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].format)}
                            style={style.format}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Pages"
                            name="pages"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].pages)}
                            style={style.page}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Publisher"
                            name="publisher"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].publisher)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Language"
                            name="language"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].language)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="ISBN-10"
                            name="isbn10"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].isbn10)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="ISBN-13"
                            name="isbn13"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].isbn13)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Copies Available"
                            name="numAvailable"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].numAvailable)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Copies Total"
                            name="numTotal"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].numTotal)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                </div>
            );
            break;
            case 'music':
            itemDetail = (
                <div className="fixed" style={style.body} key={this.state.catalogueItems[id][0].asin}>
                    <Button color="primary" onClick={() => { this.setState({detailedItemBool: false}) }}>Back to musics View</Button>
                    <br/>
                    <TextField
                            label="Title"
                            name="title"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].title)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Artist"
                            name="artist"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].artist)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Type"
                            name="type"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].type)}
                            style={style.type}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Label"
                            name="label"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].label)}
                            style={style.page}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Release Date"
                            name="releaseDate"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].releaseDate)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="ASIN"
                            name="asin"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].asin)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Copies Available"
                            name="numAvailable"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].numAvailable)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                        <TextField
                            label="Copies Total"
                            name="numTotal"
                            margin="normal"
                            defaultValue= {(this.state.catalogueItems[id][0].numTotal)}
                            style={style.textField}
                            onChange={this.handleChange}
                            disabled />
                        <br/>
                </div>
            );
            break;
        case 'movie':
        itemDetail = (
            <div className="fixed" style={style.body} key={this.state.catalogueItems[id][0].eidr}>
                <Button color="primary" onClick={() => { this.setState({detailedItemBool: false}) }}>Back to movies View</Button>
                <br/>
                <TextField
                        label="Title"
                        name="title"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].title)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="Director"
                        name="director"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].director)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="Producers"
                        name="producers"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].producers)}
                        style={style.producers}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="Actors"
                        name="actors"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].actors)}
                        style={style.page}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="Language"
                        name="language"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].language)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="Subtitles"
                        name="subtitles"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].subtitles)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="Dubbed"
                        name="dubbed"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].dubbed)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="Release Date"
                        name="releaseDate"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].releaseDate)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="Run Time"
                        name="runTime"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].runTime)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="EIDR"
                        name="eidr"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].eidr)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="Copies Available"
                        name="numAvailable"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].numAvailable)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="Copies Total"
                        name="numTotal"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].numTotal)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
            </div>
        );
        break;
        case 'magazine':
        itemDetail = (
            <div className="fixed" style={style.body} key={this.state.catalogueItems[id][0].isbn13}>
                <Button color="primary" onClick={() => { this.setState({detailedItemBool: false}) }}>Back to magazines View</Button>
                <br/>
                <TextField
                        label="Title"
                        name="title"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].title)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="Publisher"
                        name="publisher"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].publisher)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                <TextField
                    label="Date"
                    name="date"
                    margin="normal"
                    defaultValue= {(this.state.catalogueItems[id][0].date)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled />
                <br/>
                    <TextField
                        label="Language"
                        name="language"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].language)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="ISBN-10"
                        name="isbn10"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].isbn10)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                    <TextField
                        label="ISBN-13"
                        name="isbn13"
                        margin="normal"
                        defaultValue= {(this.state.catalogueItems[id][0].isbn13)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled />
                    <br/>
                <TextField
                    label="Copies Available"
                    name="numAvailable"
                    margin="normal"
                    defaultValue= {(this.state.catalogueItems[id][0].numAvailable)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled />
                <br/>
                <TextField
                    label="Copies Total"
                    name="isbn13"
                    margin="normal"
                    defaultValue= {(this.state.catalogueItems[id][0].numTotal)}
                    style={style.textField}
                    onChange={this.handleChange}
                    disabled />
                <br/>
            </div>
        );
        break;
    default: itemDetail = (<div></div>);
    
    }
    this.setState({
        detailedItemBool: true,
        detailedItem: itemDetail,
    });
    console.log(this.state.catalogueItems[id][0].title);
    return itemDetail;
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