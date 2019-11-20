import React, {Component} from 'react';
import {Input, Button, Form, FormGroup, Label, Alert, InputGroup, InputGroupButton, InputGroupAddon} from "reactstrap"
import PaymentAPI from "../../api/PaymentAPI";
import LoadingOverlay from "react-loading-overlay";
class PayNow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentAmount: 0.0,
            fees: 0.0,
            invalidAmount: false,
            error: false,
            success: false,
            accountName: "",
            loading: false
        }

        this.state.paymentAmount = this.props.paymentAmount
        this.state.fees = this.calculateFees(this.props.paymentAmount)

        this.paymentApi = new PaymentAPI();
    }

    submit(e) {
        e.preventDefault()
        if (Number(this.state.paymentAmount) <= Number(this.props.paymentAmount)) {
            let total = (Number(this.state.fees) + Number(this.state.paymentAmount)).toFixed(2)
            this.setState({
                loading: true
            }, () => {
                this.paymentApi.charge(total).then(result => {
                    if (result["error"] === "Success") {
                        this.setState({
                            success: true,
                            invalidAmount: false,
                            error: false,
                            loading: false
                        }, () => {
                            this.props.refresh()
                        })
                    } else {
                        this.setState({
                            error: true,
                            invalidAmount: false,
                            loading: false
                        })
                    }
                }).catch(() => {
                    this.setState({
                        error: true,
                        invalidAmount: false,
                        loading: false
                    })
                })
            })

        } else {
            this.setState({
                error: false,
                invalidAmount: true,
            })
        }

    }

    calculateFees(amount) {
        let total = amount / .992;
        let fees = total - amount;
        if (fees > 5)
            return 5;
        return fees.toFixed(2);
    }

    deleteAccount() {
        this.paymentApi.deleteAccount().then(result => {
            if (this.props.postDelete) {
                this.props.postDelete()
            }
        })
    }

    render() {
        return (
            <div>
                <LoadingOverlay
                    active={this.state.loading}
                    spinner
                    text='Loading...'
                >
                    <div className="text-center">
                        <h3 style={{"textDecoration": "underline"}}>Pay Now</h3>
                        <p>Please enter an amount to pay. Each transaction will be assessed a transaction fee, which will be equal to 0.8% of the transaction value,
                            capped at $5. You can enter any amount less than or equal to the total amount that you owe,
                            which is: <span style={{fontWeight: "bold"}}>${this.props.paymentAmount}</span>. If a charge bounces, you will be charged an additional fee.</p>
                    </div>
                    <Alert color="danger" isOpen={this.state.invalidAmount}>
                        Please enter an amount less than or equal to ${this.props.paymentAmount}
                    </Alert>
                    <Alert color="danger" isOpen={this.state.error}>
                        An error occurred processing this payment. Please contact an administrator.
                    </Alert>
                    <Alert color="success" isOpen={this.state.success}>
                        Successfully processed payment. Your account should be debited in the next 4-5 business days.
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
                                    <InputGroupButton
                                        name="deleteAccount"
                                        onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.deleteAccount() } }
                                        size="sm"
                                        color="danger">Delete</InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label for="paymentAmount">Payment Amount</Label>
                            <Input type="number"
                                   name="paymentAmount"
                                   placeholder={"0.0"}
                                   value={this.state.paymentAmount}
                                   onChange={(e) => {this.setState({paymentAmount: e.target.value, fees: this.calculateFees(e.target.value)})}}
                                   required/>
                        </FormGroup>
                        <h5>Fees: ${this.state.fees}</h5>
                        <h5>Total: ${(Number(this.state.fees) + Number(this.state.paymentAmount)).toFixed(2)}</h5>
                        <div className="text-center">
                            <Button type="submit">Pay Now</Button>
                        </div>
                    </Form>
                </LoadingOverlay>
            </div>
        );
    }
}

export default PayNow;