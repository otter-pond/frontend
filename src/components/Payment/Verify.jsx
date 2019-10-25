import React, {Component} from 'react';
import {injectStripe} from 'react-stripe-elements';
import {Input, Button} from "reactstrap"
class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routingNumber: "",
            accountNumber: "",
            accountHolder: "",
        }
    }

    submit() {
        this.props.stripe.createToken('bank_account', {
            country: 'US',
            currency: 'usd',
            routing_number: this.state.routingNumber,
            account_number: this.state.accountNumber,
            account_holder_name: 'Jenny Rosen',
            account_holder_type: 'individual',
        }).then(result => {
            console.log(JSON.stringify(result))
        }).catch(e => {
            console.log(JSON.stringify(e))
        })
    }

    render() {
        return (
            <div>
                <div className="text-center">
                    <h3 style={{"textDecoration": "underline"}}>Add Bank Account</h3>
                    <p>Otter Pond has partnered with <a href="https://stripe.com/">Stripe</a>, a PCI compliant payment processor, to enable payments from the web. None of your
                    account details will be sent to Otter Pond's server or stored by Otter Pond.</p>
                </div>
                <p>Would you like to complete the purchase?</p>
                <Input type="text" name="routingNumber" placeholder={"Account Holder Name"} value={this.state.accountHolder} onChange={(e) => {this.setState({accountHolder: e.target.value})}}/>
                <Input type="text" name="routingNumber" placeholder={"Routing Number"} value={this.state.routingNumber} onChange={(e) => {this.setState({routingNumber: e.target.value})}}/>
                <Input type="text" name="accountNumber" placeholder={"Account Number"} value={this.state.accountNumber} onChange={(e) => {this.setState({accountNumber: e.target.value})}}/>
                <Button onClick={() => {this.submit()}}>Verify</Button>


                <div id="mandate-acceptance">
                    By providing your IBAN and confirming this payment, you are authorizing
                    Rocketship Inc. and Stripe, our payment service provider, to send
                    instructions to your bank to debit your account and your bank to debit
                    your account in accordance with those instructions. You are entitled to
                    a refund from your bank under the terms and conditions of your agreement
                    with your bank. A refund must be claimed within 8 weeks starting from the
                    date on which your account was debited.
                </div>
            </div>
        );
    }
}

export default injectStripe(Verify);