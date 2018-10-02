//import React, { Component } from 'react';
import UserController from '../../controllers//UserController.js'

export default class Administrator {

    constructor(id, EMail, FirstName, LastName, Phone, Address) {
        this.id = id;
        this.EMail = EMail;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Phone = Phone;
        this.Address = Address;
    }

    // Always pass the authToken from the cookies
    refreshActiveToken = function(authToken) {
        UserController.refreshUserToken(this.id, authToken);
    }

    // Commented because there is no function UserController.createAdmin with the specified signature
    // createAdmin = function(authToken, id, EMail, FirstName, LastName, Phone, Address) {
    //     UserController.createAdmin(this.id, authToken, id, EMail, FirstName, LastName, Phone, Address);
    // }
}
