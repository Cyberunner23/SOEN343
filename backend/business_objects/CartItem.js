// One instance of this class will exist for each item in the cart, including multiples of the same book, music, etc.
class CartItem 
{
    constructor(props) 
    {
        // ID for the user for which this cart item is in their cart.
        this.userID = props.userID;
        // ID of this cart item.
        this.cartItemID = props.cartItemID;
        // ID of the item type in the cart
        this.itemID = props.itemID;

        // continue...
    }
}

exports.CartItem = CartItem;
