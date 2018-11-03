const Music = require('../business_objects/Music.js').Music
const musicGateway = require('../gateways/MusicGateway').getInstance();

class MusicMapper {
    
    constructor () {
        musicGateway.loadMusics()
        .then(musics => {
            this.musics = musics
        })
    }

    getMusics(callback) {
        if (callback) {
            var filteredMusics = this.musics.filter(music => {
                return callback(music);
            })
            return filteredMusics;
        }
        else {
            return this.musics;
        }
    }

    async addMusic(jsonMusic) {
        return new Promise((resolve, reject) => {
            var newMusic = new Music(jsonMusic);
            this.musics.push(newMusic);
            musicGateway.addMusic(newMusic)
            .catch(exception => {
                reject(exception);
                return;
            })
            resolve(newMusic);
        })
    }

    async removeMusics(callback) {
        return new Promise((resolve, reject) => {
            var removedMusics = [];
            if (callback) {
                this.musics = this.musics.filter(music => {
                    if(callback(music)) {
                        removedMusics.push(music);
                    }
                    return !callback(music);
                })
            } else {
                removedMusics = this.musics;
                this.musics = [];
            }
            var asinsToDelete = [];
            removedMusics.forEach(music => {
                asinsToDelete.push(music.asin);
            })
            musicGateway.deleteMusics(asinsToDelete)
            .then(() => {
                resolve(removedMusics);
            })
            .catch(exception => {
                reject(exception);
            })
        })
    }

    async modifyMusics(modifyProperties, callback) {
        return new Promise(async (resolve, reject) => {    
            this.modify(this.musics, modifyProperties, callback)
            .then(async arrayOfModifiedMusics => {
                var exception = null;
                for (var i = 0 ; i < arrayOfModifiedMusics.length && exception === null; i++) {
                    await musicGateway.updateMusic(arrayOfModifiedMusics[i])
                    .catch(e => {
                        exception = e;
                    })
                }
                if (exception !== null) {
                    reject(exception);
                }
                else { 
                    resolve(arrayOfModifiedMusics);
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

const instance = new MusicMapper();
exports.getInstance = () => {
    return instance;
}