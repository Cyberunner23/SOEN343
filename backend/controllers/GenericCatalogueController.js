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
        this.recordType = null;
    }

    async get(req, res) {
        this.mapper.get(req.query)
        .then(result => {
            res.status(200);
            res.json(result);
        })
        .catch(exception => {
            handleException(res, exception);
        })
    }
    
    async add(req, res) {
        identifyUser(req.body.authToken)
        .then(async user => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            // isbn is unique so use isbn to check for exiting record
            var filters = {};
            filters[this.identifier] = req.body[this.identifier];
            this.mapper.get(filters)
            .then(result => {
                if(result.length === 0){
                    this.mapper.add(new this.recordType(req.body))
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
            .catch(exception => {
                handleException(res, exception);
            })
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
            var filters = {};
            filters[this.identifier] = req.body[this.identifier];
            this.mapper.get(filters)
            .then(result => {
                if(result.length === 1){
                    this.mapper.modify(filters, new this.recordType(req.body))
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
            .catch(exception => {
                handleException(res, exception);
            })
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
            var filters = {};
            filters[this.identifier] = req.body[this.identifier];
            this.mapper.get(filters)
            .then(result => {
                if(result.length === 1){
                    this.mapper.remove(filters)
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
            .catch(exception => {
                handleException(res, exception);
            })
        })
        .catch((ex) => {
            handleException(res, ex);
        });
    }
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