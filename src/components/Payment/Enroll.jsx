import React, {Component} from 'react';
import {injectStripe} from 'react-stripe-elements';
import {Input, Button, Form, FormGroup, Label} from "reactstrap"
import PaymentAPI from "../../api/PaymentAPI";
class Enroll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routingNumber: "",
            accountNumber: "",
            accountHolder: "",
        }

        this.paymentApi = new PaymentAPI()
    }

    submit(e) {
        e.preventDefault()
        this.props.stripe.createToken('bank_account', {
            country: 'US',
            currency: 'usd',
            routing_number: this.state.routingNumber,
            account_number: this.state.accountNumber,
            account_holder_name: this.state.accountHolder,
            account_holder_type: 'individual',
        }).then(result => {
            this.paymentApi.enrollBankAccount(result["token"]["id"]).then(() =>{
                if (this.props.postEnroll) {
                    this.props.postEnroll()
                }
            })
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
                    account details will be sent to Otter Pond's server or stored by Otter Pond. For more information on Stripe and their security,
                    please visit <a href="https://stripe.com/docs/security/stripe">this website</a>.</p>
                    <p>To enroll for online payments, please fill out the following form. After you enroll, Stripe will verify your account by depositing two small amounts,
                    called microdeposits, which would will then have to confirm the value of before you will be able to complete any payments.</p>
                </div>
                <Form onSubmit={(e) => {this.submit(e)}} class="needs-validation" novalidate>
                    <FormGroup>
                        <Label for="accountHolderInput">Account Holder Name</Label>
                        <Input type="text"
                               name="accountHolder"
                               id="accountHolderInput"
                               placeholder={"John Doe"}
                               value={this.state.accountHolder}
                               onChange={(e) => {this.setState({accountHolder: e.target.value})}}
                               required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="routingNumberInput">Routing Number</Label>
                        <Input type="number"
                               name="routingNumber"
                               placeholder={"000000000"}
                               value={this.state.routingNumber}
                               onChange={(e) => {this.setState({routingNumber: e.target.value})}}
                               required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="accountNumberInput">Account Number</Label>
                        <Input type="number"
                               name="accountNumber"
                               placeholder={"000000000000"}
                               value={this.state.accountNumber}
                               onChange={(e) => {this.setState({accountNumber: e.target.value})}}
                               required/>
                    </FormGroup>
                    <div className="text-center">
                        <Button type="submit">Enroll</Button>
                    </div>
                </Form>

            </div>
        );
    }
}

export default injectStripe(Enroll);