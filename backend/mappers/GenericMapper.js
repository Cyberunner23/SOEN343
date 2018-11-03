exports.GenericMapper = class GenericMapper {

    constructor () {
        this.identifier = 'identifier';
        this.identityMap = null;
        this.gateway = null;
    }

    initialize() {
        this.gateway.get()
        .then(records => {
            records.forEach(record => {
                this.identityMap.add(record);
            })
        })
    }

    get(callback) {
        return this.identityMap.get(callback);
    }

    async add(record) {
        return new Promise((resolve, reject) => {
            this.identityMap.add(record);
            this.gateway.add(record);
            resolve(record);
        })
    }

    async remove(callback) {
        new Promise((resolve, reject) => {
            var removedRecords = [];
            if (callback) {
                removedRecords = this.identityMap.get(record => {
                    return callback(record);
                })
            } else {
                removedRecords = this.identityMap.get();
            }
            var identifiersToRemove = [];
            removedRecords.forEach(record => {
                identifiersToRemove.push(record[this.identifier]);
            })
            this.identityMap.remove(identifiersToRemove);
            this.gateway.delete(identifiersToRemove);
            resolve(removedRecords);
        })
    }

    async modify(modifyProperties, callback) {
        return new Promise(async (resolve, reject) => {
            var arrayOfModifiedRecords = this.modifyHelper(this.identityMap.get(callback), modifyProperties, callback);
            for (var i = 0 ; i < arrayOfModifiedRecords.length; i++) {
                await this.gateway.update(arrayOfModifiedRecords[i]);
            }
            resolve(arrayOfModifiedRecords);
        })
    }

    /**
     * Modify items in the supplied cache that meet the selector criterea, with
     * the keys to be modified and their value in the supplied modifyProperties.
     * Return the modified objects.
     * 
     * @param {any[]} cache - The array of objects to select from
     * @param {JSON} modifyProperties - Collection of named properties and their values
     * @param {Function} [selector] - Function that takes a cache item and returns true 
     *                                if it is to be modified
     */
    modifyHelper(cache, modifyProperties, selector) {
            let toModify = [];

            // Select objects to modify
            if (selector) {
                toModify = cache.filter(selector);
            } else { // Without selector predicate, modify all items
                toModify = cache;
            }

            // Copy the properties defined in modifyProperties to selected items
            toModify.forEach((item) => {
                for (let property in modifyProperties) {
                    item[property] = modifyProperties[property];
                }
            });
            return toModify;
    }
}