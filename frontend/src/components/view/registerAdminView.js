import React, { Component } from 'react';
import RegisterView from './registerUserView.js';

class RegisterAdminView extends RegisterView {

    constructor(props) {
        super(props);
        // This component will be used to implement the specifics of registering an admin
    }
}

export default RegisterAdminView;