//import React, { Component } from 'react';
import UserController from '../../controllers//UserController.js'

export default class Administrator {

    constructor(userID, email, firstName, lastName, phoneNumber, homeAddress) {
        this.userID = userID;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.homeAddress = homeAddress;
    }

    // Always pass the authToken from the cookies
    refreshActiveToken = function(authToken) {
        UserController.refreshUserToken(this.userID, authToken);
    }

    createAdmin = function(authToken, userID, email, firstName, lastName, phoneNumber, homeAddress) {
        UserController.createAdmin(this.userID, authToken, userID, email, firstName, lastName, phoneNumber, homeAddress);
    }
}
