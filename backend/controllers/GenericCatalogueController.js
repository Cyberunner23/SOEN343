const identifyUser = require('./UserController').identifyUser;
const Exceptions = require('../Exceptions').Exceptions;

exports.GenericCatalogueController = class GenericCatalogueController {
    constructor() {
        this.mapper = null;
        this.recordName = null;
        this.identifier = null;
        this.get = this.get.bind(this);
        this.add = this.add.bind(this);
        this.modify = this.modify.bind(this);
        this.delete = this.delete.bind(this);
    }

    async get(req, res) {
        var result = this.mapper.get()
        res.status(200);
        res.json(result);
    }
    
    async add(req, res) {
        identifyUser(req.body.authToken)
        .then(user => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // isbn is unique so use isbn to check for exiting record
            var result = this.mapper.get(record => {
                return record[this.identifier] === req.body[this.identifier];
            })
            if(result.length === 0){
                this.mapper.add(req.body)
                    .then(record => {
                        res.status(200);
                        res.json(record);
                    })
                    .catch(ex => {
                        handleException(res, ex);
                    });
            } else {
                console.log(this.recordName + ' already in catalogue');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleException(res, ex);
        });
    }
    
    async modify (req, res) {
        identifyUser(req.body.authToken)
        .then(user => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // find record
            var result = this.mapper.get(record => {
                return record[this.identifier] === req.body[this.identifier];
            })
            if(result.length === 1){
                this.mapper.modify(req.body, record => {
                    return record[this.identifier] === req.body[this.identifier];
                })
                    .then(record => {
                        res.status(200);
                        res.json(record[0]);
                    })
                    .catch(ex => {
                        handleException(res, ex);
                    });
            } else if(result.length === 0) {
                console.log(this.recordName + ' does not exist');
                res.status(400);
                res.send();
            } else {
                console.log('found more than one ' + this.recordName + ' to modify');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleException(res, ex);
        });
    }
    
    async delete (req, res) {
        identifyUser(req.body.authToken)
        .then(user => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // find record
            var result = this.mapper.get(record => {
                return record[this.identifier] === req.body[this.identifier];
            })
            if(result.length === 1){
                this.mapper.remove(record => {
                    return record[this.identifier] === req.body[this.identifier];
                })
                    .then(() => {
                        res.status(200);
                        res.send();
                    })
                    .catch((ex) => {
                        handleException(res, ex);
                    });
            } else if(result.length === 0) {
                console.log(this.recordName + ' does not exist');
                res.status(400);
                res.send();
            } else {
                console.log('found more than one ' + this.recordName + ' to delete');
                res.status(400);
                res.send();
            }
        })
        .catch((ex) => {
            handleException(res, ex);
        });
    }
}

filter = function(item, filters){
    var toReturn = true;
    for(var filter in filters){
        if(isNaN(filter) || isNaN(item[filter])){
            toReturn = toReturn && (filter === undefined || item[filter].toLowerCase().includes(filter.toLowerCase()));
        } else {
            toReturn = toReturn && (filter === undefined || item[filter].includes(filter));
        }
    }
    return toReturn;
}

handleException = function(res, exception) {
    var message;
    switch(exception){
        case Exceptions.InternalServerError:
        default:
            message = "InternalServerError";
            res.status(500);
    }
    res.json({err: message});
}