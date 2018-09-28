//import React, { Component } from 'react';
import UserController from '../UserController/UserController.js'

export class Client {

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
}
