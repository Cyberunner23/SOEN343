class Transaction 
{
    constructor(props) 
    {
        // ID of the transaction.
        this.transactionId = props.transactionId;
        // User who made this transaction.
        this.userId = props.userId;
        // Type of transaction.
        this.transactionType = props.transactionType;
        // Timestamp of the transaction.
        this.transactionTime = props.transactionTime;
		// Bool; 0 if the item is currently loaned out, 1 if returned
        this.isReturned = props.isReturned;
        // ID of item that was loaned through this transaction
        this.recordId = props.recordId;
		// Type of item that was loaned
        this.recordType = props.recordType;
    }
}

exports.Transaction = Transaction;
