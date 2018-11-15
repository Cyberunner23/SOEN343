class Transaction 
{
    constructor(props) 
    {
        // ID of the transaction.
        this.transactionID = props.transactionID;
        // User who made this transaction.
        this.userID = props.userID;
        // Items that were loaned through this transaction. (Array of LoanItem)
        this.loanedItems = props.loanedItems;
    }
}

exports.Transaction = Transaction;
