import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const sorter = require('../../../helper_classes/Sorter.js').getInstance();

export default class ViewCart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '', id: '', type: '',
            titleFilter: '', idFilter: '', typeFilter: '',
            app: props.app,
            loans: [],
            loanedItemstoReturn: [],
            modifyLoan: false,
            loanModified: false,
            desc: false,
            authToken: props.app.state.currentUser.authToken,
            is_admin: props.is_admin
        };
    }

    componentDidMount() {
        //Change to getLoans
        fetch('/api/catalogue/getBooks') 
            .then(res => {
                res.json().then(
                    loans => this.setState({ loans: loans })
                )
            });
    }

    render() {
        var loanModifiedMessage;
        if (this.state.loanModified) {
            loanModifiedMessage = (
                <div>{this.state.loanModifiedMessage}</div>
            )
        }
        var content;
        content = (
            <div>
                {loanModifiedMessage}
                <Table style={style.format}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('title')} direction={'desc'}>Title</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('author')} direction={'desc'}>Type</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('id')} direction={'desc'}>id</TableSortLabel>
                            </TableCell>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.loans.map((item, i) =>
                            <TableRow key={i}>
                                <TableCell>
                                    {(item.title)}
                                </TableCell>
                                <TableCell>
                                    {(item.type)}
                                </TableCell>
                                <TableCell>
                                    {item.id}
                                </TableCell>
                                <TableCell>
                                {this.state.modifyLoan == true &&
                                    <Checkbox color="default" checked={this.state.loanedItemstoReturn.includes(item)} value={item.id} onChange={this.itemToReturn(item)} />
                                }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {this.state.modifyLoan == false &&
                <p>
                    <Button color="primary" onClick={() => { this.setState({modifyLoan: true}) }}>Return Items</Button>
                </p>}
                
                {this.state.modifyLoan == true &&
                <p>
                    <Button color="primary" onClick={() => { this.returnLoan() }}>Confirm</Button>
                </p>}
            </div>
        );

        return (
            <div className='ViewCartComponent UseCaseComponent'>
                <h2>My Loans</h2>
                {content}
            </div>
        )
    }

    sort(field) {
        if (field === 'pages') {
            sorter.intSort(this.state.loans, field, this.state.desc);
        }
        else {
            sorter.stringSort(this.state.loans, field, this.state.desc);
        }
        this.setState({loans: this.state.loans, desc: !this.state.desc});
    }

    itemToReturn = item => event =>  {
        var toReturn = this.state.loanedItemstoReturn;
        if(event.target.checked) toReturn.push(item);
        else {
            var index = toReturn.indexOf(item);
            if(typeof index !== 'undefined' && index > -1) toReturn.splice(index, 1);
        }
        this.setState({
            loanedItemstoReturn: toReturn
        });
        console.log(this.state.loanedItemstoReturn);
    }

    async returnLoan() {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/returnLoan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({returnItems: this.state.loanedItemstoReturn, authToken: this.state.authToken })
            }).then((res => {
                if (res.status === 200) {
                    console.log("returned item");
                    this.setState({ modifyLoan: false, loanModified: true, loanModifiedMessage: 'Loan return successfully' })
                } else {
                    console.log(res)
                    this.setState({ modifyLoan: false, loanModified: true, loanModifiedMessage: 'Loan could not be returned' })
                }
            })).then(() => { this.componentDidMount(); });
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