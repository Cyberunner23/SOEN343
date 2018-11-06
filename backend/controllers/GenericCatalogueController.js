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
        .then(records => {
            res.status(200);
            res.json(records);
        })
        .catch(ex => {
            handleException(res, ex);
        })
    }
    
    async add(req, res) {
        identifyUser(req.body.authToken)
        .then(async user => {
            if(!user.is_admin){
                handleException(res, Exceptions.Unauthorized);
                return;
            }
            this.mapper.add(new this.recordType(req.body))
            .then(record => {
                res.status(200);
                res.json(record);
            })
            .catch(ex => {
                handleException(res, ex);
            });
        })
        .catch(ex => {
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
            var filters = {};
            filters[this.identifier] = req.body[this.identifier];
            this.mapper.modify(filters, new this.recordType(req.body))
            .then(updatedRecords => {
                if (updatedRecords.length === 0) {
                    handleException(res, Exceptions.BadRequest);
                }
                else {
                    res.status(200);
                    res.json(updatedRecords[0]); // There should be only 1 record because the filter is a unique identifier
                }
            })
            .catch(ex => {
                handleException(res, ex);
            });
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
            var filters = {};
            filters[this.identifier] = req.body[this.identifier];
            this.mapper.remove(filters)
                .then(removedRecords => {
                    if (removedRecords.length === 0) {
                        handleException(res, Exceptions.BadRequest);
                    }
                    else {
                        res.status(200);
                        res.json(removedRecords[0]); // There should be only 1 record because the filter is a unique identifier
                    }
                })
                .catch(ex => {
                    handleException(res, ex);
                });
        })
        .catch((ex) => {
            handleException(res, ex);
        });
    }
}

handleException = function(res, exception) {
    var message;
    switch(exception){
        case Exceptions.BadRequest:
            message = "BadRequest";
            res.status(400);
            break;
        case Exceptions.Unauthorized:
            message = "Unauthorized";
            res.status(401);
            break;
        case Exceptions.InternalServerError:
        default:
            message = "InternalServerError";
            res.status(500);
            break;
    }
    res.json({err: message});
}