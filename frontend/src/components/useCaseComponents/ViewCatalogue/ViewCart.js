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
            cart: [],
            modifyCart: false,
            cartModified: false,
            desc: false,
            authToken: props.app.state.currentUser.authToken,
            is_admin: props.is_admin
        };
    }

    componentDidMount() {
        fetch('/api/catalogue/getCartItems')
            .then(res => {
                res.json().then(
                    cart => this.setState({ cart: cart })
                )
            });
    }

    render() {
        var cartModifiedMessage;
        if (this.state.cartModified) {
            cartModifiedMessage = (
                <div>{this.state.cartModifiedMessage}</div>
            )
        }
        var content;
        content = (
            <div>
                {cartModifiedMessage}
                <Table style={style.format}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('title')} direction={'desc'}>Title</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('type')} direction={'desc'}>Type</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel onClick={() => this.sort('id')} direction={'desc'}>ID</TableSortLabel>
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.cart.map((item, i) =>
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
                                    <Button color="secondary" onClick={() => { this.removeCart(item.id) }} disabled>Remove</Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Button color="primary" onClick={() => { this.loanCart() }} disabled>Loan Items</Button>
            </div>
        );

        return (
            <div className='ViewCartComponent UseCaseComponent'>
                <h2>My Cart</h2>
                {content}
            </div>
        )
    }

    sort(field) {
        if (field === 'pages') {
            sorter.intSort(this.state.cart, field, this.state.desc);
        }
        else {
            sorter.stringSort(this.state.cart, field, this.state.desc);
        }
        this.setState({cart: this.state.cart, desc: !this.state.desc});
    }

    async removeCart(id) {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/removeCart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({itemID: id, authToken: this.state.authToken })
            }).then((res => {
                if (res.status === 200) {
                    console.log("deleted item");
                    this.setState({ modifyCart: false, cartModified: true, cartModifiedMessage: 'Cart item removed successfully' })
                } else {
                    console.log(res)
                    this.setState({ cartModified: true, cartModifiedMessage: 'Loan could not be removed' })
                }
            })).then(() => { this.componentDidMount(); });
        })
    }

    async loanCart() {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/loanCart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({cartItems: this.state.cart, authToken: this.state.authToken })
            }).then((res => {
                if (res.status === 200) {
                    console.log("Items Loaned");
                    this.setState({ modifyCart: true, cartModified: true, cartModifiedMessage: 'Cart items loaned' })
                } else {
                    console.log(res)
                    this.setState({ cartModified: true, cartModifiedMessage: 'Could not be loaned' })
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