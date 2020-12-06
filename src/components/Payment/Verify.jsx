import React, {Component} from 'react';
import {Input, Button, Form, FormGroup, Label, Alert, InputGroup, InputGroupAddon} from "reactstrap"
import PaymentAPI from "../../api/PaymentAPI";
import LoadingOverlay from "react-loading-overlay";
import Notify from "react-notification-alert";
class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deposit1: "",
            deposit2: "",
            invalid: false,
            loading: false
        }

        this.paymentApi = new PaymentAPI()
    }

    submit(e) {
        e.preventDefault()
        this.setState({
            loading: true
        }, () => {
            this.paymentApi.verifyAccount(this.state.deposit1, this.state.deposit2).then(result => {
                if (result["error"] === "Success" && this.props.postVerify) {
                    this.props.postVerify()
                } else {
                    this.setState({
                        deposit1: "",
                        deposit2: "",
                        invalid: true,
                        loading: false
                    })
                }
            }).catch(e => {
                var options = {
                    place: "tc",
                    message: `Error executing request`,
                    type: "danger",
                    autoDismiss: -1,
                    closeButton: true
                };
                this.refs.notify.notificationAlert(options);
            })
        })
    }

    deleteAccount() {
        this.setState({
            loading: true
        }, () => {
            this.paymentApi.deleteAccount().then(result => {
                this.setState({
                    loading: false
                }, () => {
                    if (this.props.postVerify) {
                        this.props.postVerify()
                    }
                })
            }).catch(e => {
                var options = {
                    place: "tc",
                    message: `Error executing request`,
                    type: "danger",
                    autoDismiss: -1,
                    closeButton: true
                };
                this.refs.notify.notificationAlert(options);
            })
        })

    }

    render() {
        return (
            <div>
                <Notify ref="notify"/>
                <LoadingOverlay
                    active={this.state.loading}
                    spinner
                    text='Loading...'
                >
                    <div className="text-center">
                        <h3 style={{"textDecoration": "underline"}}>Verify Bank Account</h3>
                        <p>Now that you've added your bank account, it needs to be verified before it can be used. <a href="https://stripe.com/">Stripe</a> will make two separate small deposits
                        (microdeposits) into your account over the next 1-2 days. Once they do, come back here and enter the amounts in whole numbers
                        (i.e. $0.32 -> 32). Once you verify you will be able to make payments</p>
                    </div>
                    <Alert color="danger" isOpen={this.state.invalid}>
                        Invalid verification amounts. Please check your bank account and try again. You are limited to 10 attempts to verify. Please contact an
                        administrator if you believe this is an error
                    </Alert>
                    <Form onSubmit={(e) => {this.submit(e)}} class="needs-validation" novalidate>
                        <FormGroup>
                            <Label for="accountHolderInput">Account</Label>
                            <InputGroup>
                                <Input type="text"
                                   id="accountHolderInput"
                                   value={this.props.accountName}
                                   disabled/>
                                <InputGroupAddon addonType="append">
                                    {/*Used to be InputGroupButton but had to change it. Might cause some issues...*/}
                                    <Button
                                        name="deleteAccount"
                                        onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.deleteAccount() } }
                                        size="sm"
                                        color="danger">Delete</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label for="routingNumberInput">Deposit Amount 1</Label>
                            <Input type="number"
                                   name="routingNumber"
                                   placeholder={"00"}
                                   value={this.state.deposit1}
                                   onChange={(e) => {this.setState({deposit1: e.target.value})}}
                                   required/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="accountNumberInput">Deposit Amount 2</Label>
                            <Input type="number"
                                   name="accountNumber"
                                   placeholder={"00"}
                                   value={this.state.deposit2}
                                   onChange={(e) => {this.setState({deposit2: e.target.value})}}
                                   required/>
                        </FormGroup>
                        <div className="text-center">
                            <Button type="submit">Verify Account</Button>
                        </div>
                    </Form>
                </LoadingOverlay>
            </div>
        );
    }
}

export default Verify;