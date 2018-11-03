exports.GenericIdentityMap = class GenericIdentityMap {
    constructor() {
        this.records = [];
        this.identifier = 'identifier';
    }
    clear() {
        this.records = [];
    }
    get(selector) {
        if (selector === undefined) {
            selector = record => {return true}; // select all records
        }
        return this.records.filter(selector);
    } 
    add(record) {
        if (this.records.some(currentRecord => {
            return record[this.identifier] === currentRecord[this.identifier];
        })) {
            var err = 'Cannot add record to identity map because a record with the same identifier already exists';
            console.log(err);
            throw err;
        }
        this.records.push(record);
    }
    update(record) {
        var index = this.records.find(currentRecord => {
            return record[this.identifier] === currentRecord[this.identifier];
        })
        if (index === -1) {
            var err = 'Cannot update record in identity map because there is no record with the specified identifier';
            console.log(err);
            throw err;
        }
        this.records[index] = record;
    }
    remove(identifiersToRemove) {
        var removedRecords = [];
        identifiersToRemove.forEach(identifier => {
            var index = this.records.findIndex(record => {
                return identifier === record[this.identifier];
            })
            if (index === -1) {
                var err = 'Cannot remove record in identity map because there is no record with the specified identifier';
                console.log(err);
                throw err;
            }
            removedRecords.push(this.records.splice(index, 1));
        })
        return removedRecords;
    }
}