// One instance of this class will exist for each item in the cart, including multiples of the same book, music, etc.
class LoanItem 
{
    constructor(props) 
    {
        // The user that loaned this item.
        this.userID = props.userID;
        // ID of this cart item.
        this.loanItemID = props.loanItemID;
        // ID of the item type in the cart
        this.itemID = props.itemID;

        // continue...
    }
}

exports.LoanItem = LoanItem;
