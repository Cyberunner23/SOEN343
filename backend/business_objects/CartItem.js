// One instance of this class will exist for each item in the cart, including multiples of the same book, music, etc.
class CartItem 
{
    constructor(props) 
    {
        // ID of this cart item.
        this.cartItemId = props.cartItemId;
        // ID for the user for which this cart item is in their cart.
        this.userId = props.userId;
        // ID of the item in the cart
        this.mediaId = props.mediaId;
        // Type of item in the cart
        this.mediaType = props.mediaType;

        // continue...
    }
}

exports.CartItem = CartItem;
