import React, { Component } from 'react';
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
            makeLoan: false,
            cartModified: false,
            desc: false,
            authToken: props.app.state.currentUser.authToken,
            is_admin: props.is_admin
        };
    }

    componentDidMount() {
        // Change to getCartItems
        fetch('/api/cartItem/getCartItems', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({authToken: this.state.app.state.currentUser.authToken})
        })
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
                                <TableSortLabel>CartItemId</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>UserId</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>MediaType</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>MediaId</TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.cart.map((item, i) =>
                            <TableRow key={i}>
                                <TableCell>
                                    {(item.cartItemId)}
                                </TableCell>
                                <TableCell>
                                    {(item.userId)}
                                </TableCell>
                                <TableCell>
                                    {(item.mediaType)}
                                </TableCell>
                                <TableCell>
                                    {(item.mediaId)}
                                </TableCell>
                                <TableCell>
                                    <Button color="secondary" onClick={() => { this.removeCart(item.cartItemId) }}>Remove</Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {this.state.makeLoan === false && this.state.cart.length > 0 &&
                <p>
                    <Button color="primary" onClick={() => { this.setState({makeLoan: true}) }}>Loan Items</Button>
                </p>}

                {this.state.makeLoan === true &&
                <p>
                    Please confirm to make a loan. <br/>
                    <Button color="primary" onClick={() => { this.loanCart() }}>Confirm</Button>
                </p>}
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
        console.log('id: ' + id);
        return new Promise((resolve, reject) => {
            fetch('/api/cartItem/removeFromCart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({cartItemId: id, authToken: this.state.authToken })
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
            fetch('/api/transaction/borrowRecord', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({mediaType: this.state.cart[0].mediaType, mediaId: this.state.cart[0].mediaId, authToken: this.state.authToken })
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