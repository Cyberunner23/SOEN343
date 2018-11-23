class Transaction 
{
    constructor(props) 
    {
        // ID of the transaction.
        this.transactionId = props.transactionId;
        // User who made this transaction.
        this.userId = props.userId;
        // Type of transaction. Bool; 0 if borrow type and 1 if return type
        this.transactionType = props.transactionType;
        // Timestamp of the transaction.
        this.transactionTime = props.transactionTime;
		// Bool; 0 if the item is currently loaned out, 1 if returned
        this.isReturned = props.isReturned;
        // ID of item that was loaned through this transaction
        this.mediaId = props.mediaId;
		// Type of item that was loaned
        this.mediaType = props.mediaType;
        // Due date
        this.dueDate = props.dueDate;
    }
}

exports.Transaction = Transaction;
