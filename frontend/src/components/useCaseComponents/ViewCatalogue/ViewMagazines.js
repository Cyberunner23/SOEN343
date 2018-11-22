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

const sorter = require('../../../helper_classes/Sorter.js').getInstance();

export default class ViewMagazines extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '', publisher: '', date: '', language: '', isbn10: '', isbn13: '', numAvailable: '', numTotal: '',
            titleFilter: '', publisherFilter: '', dateFilter: '', languageFilter: '', isbn10Filter: '', isbn13Filter: '', numAvailableFilter: '', numTotalFilter: '',
            app: props.app,
            magazines: [],
            magazineItemBool: false,
            magazineItem: [],
            modifyMagazine: false,
            magazineModified: false,
            desc: false,
            lastSortField: '',
            authToken: props.app.state.currentUser.authToken,
            is_admin: props.is_admin
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('/api/catalogue/getMagazines')
            .then(res => {
                res.json().then(
                    magazines => this.setState({ magazines: magazines })
                )
            });
    }

    render() {
        var magazineModifiedMessage;
        if (this.state.magazineModified) {
            magazineModifiedMessage = (
                <div>{this.state.magazineModifiedMessage}</div>
            )
        }
        var content;
        content = (
            <div>
                <div style={style.format}>
                    <Typography>Filter By...</Typography>
                    <TextField style={style.field} label="title" name="titleFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="publisher" name="publisherFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="date" name="dateFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="language" name="languageFilter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="ISBN-10" name="isbn10Filter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="ISBN-13" name="isbn13Filter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="numAvailable" name="numAvailableFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <TextField style={style.field} label="numTotal" name="numTotalFilter" margin="dense" onChange={this.handleChange} /><br/>
                    <Button color="primary" onClick={() => { this.filter() }}>Search</Button>
                </div>
                {magazineModifiedMessage}
                <Table style={style.format}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('title')}>Title</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('publisher')}>Publisher</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('isbn13')}>ISBN-13</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('numAvailable')} direction={'desc'}>Copies Available</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('numTotal')} direction={'desc'}>Total Available</TableSortLabel>
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.magazines.map((magazine, i) =>
                            <TableRow key={i}>
                                <TableCell>
                                    {(magazine.title)}
                                </TableCell>
                                <TableCell>
                                    {(magazine.publisher)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMagazine && this.state.isbn13 === magazine.isbn13) ? (<TextField
                                        name="numAvailable"
                                        margin="dense"
                                        defaultValue={magazine.numAvailable}
                                        onChange={this.handleChange} />) : (magazine.numAvailable)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyBook && this.state.isbn13 === magazine.isbn13) ? (<TextField
                                        name="numTotal"
                                        margin="dense"
                                        defaultValue={magazine.numTotal}
                                        onChange={this.handleChange} />) : (magazine.numTotal)}
                                </TableCell>
                                <TableCell>
                                    {magazine.isbn13}
                                </TableCell>
                                {this.state.is_admin === 1 &&
                                <TableCell>
                                    {(this.state.modifyMagazine && this.state.isbn13 === magazine.isbn13) ?
                                    (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                                    (<Button color="primary" onClick={() => { this.modifyMagazineState(magazine) }}>Edit</Button>)}
                                    <Button color="secondary" onClick={() => { this.removeMagazines(magazine.isbn13) }}>Delete</Button>
                                </TableCell>}
                                {this.state.is_admin === 0 &&
                                <TableCell>
                                    <Button color="primary" onClick={() => { this.detailedMagazine(magazine, true) }}>View Details</Button>
                                    <Button variant="contained" color="secondary" onClick={() => { this.addMagazineToCart(magazine.isbn13) }}>Add to Cart</Button>
                                </TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        );

        var itemDetails;
        itemDetails = (
            <div className="fixed" style={style.body} key={this.state.magazineItem.isbn13}>
                <Button color="primary" onClick={() => { this.detailedMagazine([], false) }}>Back to magazines View</Button>
                <br/>
                <TextField
                        label="Title"
                        name="title"
                        margin="normal"
                        defaultValue= {(this.state.magazineItem.title)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyMagazine && this.state.isbn13 === this.state.magazineItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="Author"
                        name="author"
                        margin="normal"
                        defaultValue= {(this.state.magazineItem.author)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyMagazine && this.state.isbn13 === this.state.magazineItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="Format"
                        name="format"
                        margin="normal"
                        defaultValue= {(this.state.magazineItem.format)}
                        style={style.format}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyMagazine && this.state.isbn13 === this.state.magazineItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="Pages"
                        name="pages"
                        margin="normal"
                        defaultValue= {(this.state.magazineItem.pages)}
                        style={style.page}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyMagazine && this.state.isbn13 === this.state.magazineItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="Publisher"
                        name="publisher"
                        margin="normal"
                        defaultValue= {(this.state.magazineItem.publisher)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyMagazine && this.state.isbn13 === this.state.magazineItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="Language"
                        name="language"
                        margin="normal"
                        defaultValue= {(this.state.magazineItem.language)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyMagazine && this.state.isbn13 === this.state.magazineItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="ISBN-10"
                        name="isbn10"
                        margin="normal"
                        defaultValue= {(this.state.magazineItem.isbn10)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyMagazine && this.state.isbn13 === this.state.magazineItem.isbn13) ? false : true} />
                    <br/>
                    <TextField
                        label="ISBN-13"
                        name="isbn13"
                        margin="normal"
                        defaultValue= {(this.state.magazineItem.isbn13)}
                        style={style.textField}
                        onChange={this.handleChange}
                        disabled={(this.state.modifyMagazine && this.state.isbn13 === this.state.magazineItem.isbn13) ? false : true} />
                    <br/>
                    {this.state.is_admin === 0 &&
                    <p>
                        <Button variant="contained" color="secondary" onClick={() => { this.sequenceMagazine(this.state.magazineItem, false) }}>Previous</Button>
                        <Button variant="contained" color="secondary" onClick={() => { this.addMagazineToCart(this.state.magazineItem.isbn13) }}>Add to Cart</Button>
                        <Button variant="contained" color="secondary" onClick={() => { this.sequenceMagazine(this.state.magazineItem, true) }}>Next</Button>
                    </p>}
                    {this.state.is_admin === 1 &&
                    <p>
                    {(this.state.modifyMagazine && this.state.isbn13 === this.state.magazineItem.isbn13) ?
                        (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                        (<Button color="primary" onClick={() => { this.modifyMagazineState(this.state.magazineItem) }}>Edit</Button>)}
                        <Button color="secondary" onClick={() => { this.removemagazines(this.state.magazineItem.isbn13) }}>Delete</Button>
                    </p>}
            </div>
        );

        return (
            <div className='ViewmagazinesComponent UseCaseComponent'>
                <h2>Magazines</h2>
                {this.state.magazineItemBool ? itemDetails : content}
            </div>
        )
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, magazineModified: false, magazineModifiedMessage: ''});
    }

    modifyMagazineState(magazine) {
        this.setState({
            title: magazine.title,
            publisher: magazine.publisher,
            date: magazine.date,
            language: magazine.language,
            isbn10: magazine.isbn10,
            isbn13: magazine.isbn13,
            numAvailable: magazine.numAvailable,
            magazineModifiedMessage: '',
            magazineItem: magazine,
            magazineItemBool:true,
            modifyMagazine: true
        })
    }

    sort(field) {
        let currentState = this.state.desc;

        if(this.state.lastSortField !== field) {
            currentState = false;
        }
        else {
            currentState = !currentState;
        }
        sorter.stringSort(this.state.magazines, field, currentState);
        this.setState({magazines: this.state.magazines, desc: currentState, lastSortField: field});
    }

    filter() {
        let title = this.state.titleFilter;
        let publisher = this.state.publisherFilter;
        let date = this.state.dateFilter;
        let language = this.state.languageFilter;
        let isbn10 = this.state.isbn10Filter;
        let isbn13 = this.state.isbn13Filter;
        let numAvailable = this.state.numAvailableFilter;
		let numTotal = this.state.numTotalFilter;
        let jsonObject = {title, publisher, date, language, isbn10, isbn13, numAvailable, numTotal};

        Object.keys(jsonObject).forEach((key) => (jsonObject[key] === "") && delete jsonObject[key]);

        //convert json to url params
        let url = Object.keys(jsonObject).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(jsonObject[k])
        }).join('&');

        fetch('/api/catalogue/getMagazines?' + url, {
            method: 'GET'
        }).then(res => {
            res.json().then(
                magazines => this.setState({ magazines: magazines })
            )
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.modifyMagazine(this.state)
            .then((magazine) => {
                if (magazine !== null) {
                    console.log('Magazine modified successfully');
                    this.setState({ modifyMagazine: false, magazineModified: true, magazineModifiedMessage: 'Magazine ' + magazine.title + ' modified' })
                } else {
                    console.log('Modification could not be completed');
                    this.setState({ magazineModified: true, magazineModifiedMessage: 'Modification could not be completed' })
                }
            }).then(() => {
                this.componentDidMount();
            })
    }

    async removeMagazines(isbn) {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/removeMagazines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isbn13: isbn, authToken: this.state.authToken})
            }).then((res => {
                if (res.status === 200) {
                    console.log("deleted magazine");
                    this.setState({ modifyMagazine: false, magazineModified: true, magazineModifiedMessage: 'Magazine removed successfully' })
                } else {
                    console.log(res)
                    this.setState({ magazineModified: true, magazineModifiedMessage: 'Magazine could not be removed' })
                }
            })).then(() => { this.componentDidMount(); });
        })
    }

    async modifyMagazine(props) {
        let title = props.title;
        let publisher = props.publisher;
        let date = props.date;
        let language = props.language;
        let isbn10 = props.isbn10;
        let isbn13 = props.isbn13;
        let numAvailable = props.numAvailable;
		let numTotal = props.numTotal;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/modifyMagazine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({title, publisher, date, language, isbn10, isbn13, numAvailable, numTotal, authToken: this.state.authToken})
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((magazine) => {
                        resolve(magazine);
                    })
                }
                else {
                    resolve(null);
                }
            });
        })
    }

    detailedMagazine(magazine, bool) {
        this.setState({
            magazineItem: magazine,
            magazineItemBool: bool
        });
    }

    async sequenceMagazine(magazine, bool){
        var index =  this.state.magazines.indexOf(magazine);
        if(bool) index = ((this.state.magazines.length - 1) === index ? index : ++index);
        else index = (index === 0 ? 0 : --index);
        this.setState({
            magazineItem: this.state.magazines[index]
        });
    }

    async addMagazineToCart(props){
        let isbn13 = props.isbn13;

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addToCart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({isbn13 , authToken: this.state.authToken})
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((magazine) => {
                        resolve(magazine);
                    })
                }
                else {
                    resolve(null);
                }
            });
        })
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