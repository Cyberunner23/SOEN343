import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
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
            modifyLoan: false,
            loanModified: false,
            desc: false,
            authToken: props.app.state.currentUser.authToken,
            is_admin: props.is_admin
        };
    }

    componentDidMount() {
        fetch('/api/catalogue/getLoans')
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
                                <TableSortLabel onClick={() => this.sort('id')} direction={'desc'}>ID</TableSortLabel>
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
                                    <Button color="secondary" onClick={() => { this.returnLoan(item.id) }} disabled>Return</Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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

    async returnLoan(isbn) {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/returnLoan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({itemID: id, authToken: this.state.authToken })
            }).then((res => {
                if (res.status === 200) {
                    console.log("returned item");
                    this.setState({ modifyLoan: false, loanModified: true, loanModifiedMessage: 'Loan return successfully' })
                } else {
                    console.log(res)
                    this.setState({ loanModified: true, loanModifiedMessage: 'Loan could not be returned' })
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