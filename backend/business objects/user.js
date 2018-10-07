//import React, { Component } from 'react';

class User {

    constructor(props) {
        this.id = props.id;
        this.is_admin = props.is_admin;
        this.email = props.email;
        this.first_name = props.first_name;
        this.last_name = props.last_name;
        this.phone = props.phone;
        this.address = props.address;
    }

    // Always pass the authToken from the cookies
    // refreshActiveToken = function(authToken) {
    //     UserController.refreshUserToken(this.id, authToken);
    // }

    // Commented because there is no function UserController.createAdmin with the specified signature
    // createAdmin = function(authToken, id, email, first_name, last_name, phone, address) {
    //     UserController.createAdmin(this.id, authToken, id, email, first_name, last_name, phone, address);
    // }
}

exports.User = User;
