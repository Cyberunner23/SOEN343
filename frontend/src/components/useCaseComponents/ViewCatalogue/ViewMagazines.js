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
            title: '', publisher: '', date: '', language: '', isbn10: '', isbn13: '',
            titleFilter: '', publisherFilter: '', dateFilter: '', languageFilter: '', isbn10Filter: '', isbn13Filter: '',
            app: props.app,
            magazines: [],
            modifyMagazine: false,
            magazineModified: false,
            desc: false,
            authToken: props.app.state.currentUser.authToken
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
                    <TextField style={style.field} label="isbn10" name="isbn10Filter" margin="dense" onChange={this.handleChange} />
                    <TextField style={style.field} label="isbn13" name="isbn13Filter" margin="dense" onChange={this.handleChange} /><br/>
                    <Button color="primary" onClick={() => { this.filter() }}>Search</Button>
                </div>
                {magazineModifiedMessage}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('title')} direction={'desc'}>Title</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('publisher')} direction={'desc'}>Publisher</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('date')} direction={'desc'}>Date</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('language')} direction={'desc'}>Language</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('isbn10')} direction={'desc'}>ISBN-10</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('isbn13')} direction={'desc'}>ISBN-13</TableSortLabel>
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.magazines.map(magazine =>
                            <TableRow key={magazine.title}>
                                <TableCell>
                                    {(this.state.modifyMagazine && this.state.isbn13 === magazine.isbn13) ? (<TextField
                                        name="title"
                                        margin="dense"
                                        defaultValue={magazine.title}
                                        onChange={this.handleChange} />) : (magazine.title)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMagazine && this.state.isbn13 === magazine.isbn13) ? (<TextField
                                        name="publisher"
                                        margin="dense"
                                        defaultValue={magazine.publisher}
                                        onChange={this.handleChange} />) : (magazine.publisher)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMagazine && this.state.isbn13 === magazine.isbn13) ? (<TextField
                                        name="date"
                                        margin="dense"
                                        defaultValue={magazine.date}
                                        onChange={this.handleChange} />) : (magazine.date)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMagazine && this.state.isbn13 === magazine.isbn13) ? (<TextField
                                        name="language"
                                        margin="dense"
                                        defaultValue={magazine.language}
                                        onChange={this.handleChange} />) : (magazine.language)}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMagazine && this.state.isbn13 === magazine.isbn13) ? (<TextField
                                        name="isbn10"
                                        margin="dense"
                                        defaultValue={magazine.isbn10}
                                        onChange={this.handleChange} />) : (magazine.isbn10)}
                                </TableCell>
                                <TableCell>
                                    {magazine.isbn13}
                                </TableCell>
                                <TableCell>
                                    {(this.state.modifyMagazine && this.state.isbn13 === magazine.isbn13) ?
                                        (<Button color="primary" onClick={(e) => { this.handleSubmit(e) }}>Confirm</Button>) :
                                        (<Button color="primary" onClick={() => { this.modifyMagazineState(magazine) }}>Edit</Button>)}
                                    <Button color="secondary" onClick={() => { this.removeMagazines(magazine.isbn13) }}> Delete</Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        );

        return (
            <div className='ViewBooksComponent UseCaseComponent'>
                <h2>Magazines</h2>
                {content}
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
            magazineModifiedMessage: '',
            modifyMagazine: true
        })
    }

    sort(field) {
        sorter.stringSort(this.state.magazines, field, this.state.desc);
        this.setState({magazines: this.state.magazines, desc: !this.state.desc});
    }

    filter() {
        let title = this.state.titleFilter;
        let publisher = this.state.publisherFilter;
        let date = this.state.dateFilter;
        let language = this.state.languageFilter;
        let isbn10 = this.state.isbn10Filter;
        let isbn13 = this.state.isbn13Filter;
        let jsonObject = {title, publisher, date, language, isbn10, isbn13};

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

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/modifyMagazine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({title, publisher, date, language, isbn10, isbn13, authToken: this.state.authToken})
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