import React, {Component} from 'react';
import {Input, Button, Form, FormGroup, Label, Alert, InputGroup, InputGroupButton, InputGroupAddon} from "reactstrap"
import PaymentAPI from "../../api/PaymentAPI";
class Verified extends Component {

    render() {
        return (
            <div>
                <div className="text-center">
                    <h3 style={{"textDecoration": "underline"}}>Account Verified</h3>
                    <p>You're all setup! Head over to Reporting and select the most recent Finances report to complete a payment.</p>
                </div>
            </div>
        );
    }
}

export default Verified;