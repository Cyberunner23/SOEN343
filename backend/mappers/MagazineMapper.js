const Magazine = require('../business_objects/Magazine').Magazine;
const catalogGateway = require('../gateways/CatalogGateway').getInstance();

class MagazineMapper {
    
    constructor () {
        catalogGateway.loadMagazines()
        .then(magazines => {
            this.magazines = magazines;
        })
    }

    getMagazines(callback) {
        if (callback) {
            var filteredMagazines = this.magazines.filter(magazine => {
                return callback(magazine);
            })
            return filteredMagazines;
        }
        else {
            return this.magazines;
        }
    }

    async addMagazine(jsonMagazine) {
        return new Promise((resolve, reject) => {
            var newMagazine = new Magazine(jsonMagazine);
            this.magazines.push(newMagazine);
            catalogGateway.addMagazine(newMagazine)
            .catch(exception => {
                reject(exception);
                return;
            })
            resolve(newMagazine);
        })
    }

    async removeMagazines(callback) {
        return new Promise((resolve, reject) => {
            var removedMagazines = []
            if (callback) {
                this.magazines = this.magazines.filter(magazine => {
                    if(callback(magazine)) {
                        removedMagazines.push(magazine);
                    }
                    return !callback(magazine);
                })
            } else {
                removedMagazines = this.magazines;
                this.magazines = [];
            }
            var isbn13sToDelete = [];
            removedMagazines.forEach(magazine => {
                isbn13sToDelete.push(magazine.isbn13);
            })
            catalogGateway.deleteMagazines(isbn13sToDelete)
            .then(() => {
                resolve(removedMagazines);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async modifyMagazines(modifyProperties, callback) {
        return new Promise(async (resolve, reject) => {    
            this.modify(this.magazines, modifyProperties, callback)
            .then(async arrayOfModifiedMagazines => {
                var exception = null;
                for (var i = 0 ; i < arrayOfModifiedMagazines.length && exception === null; i++) {
                    await catalogGateway.updateMagazine(arrayOfModifiedMagazines[i])
                    .catch(e => {
                        exception = e;
                    })
                }
                if (exception !== null) {
                    reject(exception);
                }
                else { 
                    resolve(arrayOfModifiedMagazines);
                }
            })
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
    async modify(cache, modifyProperties, selector) {
        return new Promise((resolve, reject) => {
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
            resolve(toModify);
        });
    }
}

const instance = new MagazineMapper();
exports.getInstance = () => {
    return instance;
}