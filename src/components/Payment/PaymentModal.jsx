import {Elements} from "react-stripe-elements";
import React, {Component} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import Enroll from "./Enroll.jsx"
import Verify from "./Verify.jsx"
import Verified from "./Verified.jsx"
import PaymentAPI from "../../api/PaymentAPI";
import LoadingOverlay from "react-loading-overlay";
import PayNow from "./PayNow.jsx";

class PaymentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "",
            loading: false,
            accountName: "",
            paymentAmount: -1
        }

        this.paymentApi = new PaymentAPI()

        if (!!this.props.paymentAmount) {
            this.state.paymentAmount = this.props.paymentAmount
        }
    }

    checkAccountStatus() {
        this.setState({
            loading: true
        }, () => {
            this.paymentApi.getAccountStatus().then(status => {
                if (status["accountStatus"] === "None") {
                    this.setState({
                        status: "None",
                        loading: false
                    })
                } else {
                    this.setState({
                        status: status["accountStatus"],
                        accountName: status["accountName"],
                        loading: false
                    })
                }
            }).catch(e => {
                console.log("Unable to load account status: " + e)
            })
        })

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isOpen && !prevProps.isOpen) {
            if (this.props.paymentAmount && this.props.paymentAmount !== prevProps.paymentAmount) {
                this.setState({
                    paymentAmount: this.props.paymentAmount
                }, () => {
                    this.checkAccountStatus()
                })
            } else {
                this.checkAccountStatus()
            }
        }
    }

    close() {
        if (this.props.toggle) {
            this.props.toggle()
        }
    }

    render() {
        return (
            <div>

                    <Modal isOpen={this.props.isOpen} backdrop={true}>
                        <ModalHeader tag={"h2"}>Payment</ModalHeader>
                        <LoadingOverlay
                            active={this.state.loading}
                            spinner
                            text='Loading...'
                        >
                            <ModalBody>
                                {this.state.status === "None" ?
                                    <Elements>
                                        <Enroll postEnroll={() => {this.checkAccountStatus()}}/>
                                    </Elements>
                                : this.state.status === "new" ?
                                    <Verify accountName={this.state.accountName} postVerify={() => {this.checkAccountStatus()}} />
                                : this.state.status === "verified" && this.state.paymentAmount !== -1 ?
                                    <PayNow paymentAmount={this.state.paymentAmount} accountName={this.state.accountName} postDelete={() => {this.checkAccountStatus()}}/>

                                : this.state.status === "verified" ?
                                    <Verified />
                                :
                                    null
                                }

                            </ModalBody>
                        </LoadingOverlay>

                        <ModalFooter>
                            <div className="clearfix" style={{width: "100%"}}>
                                <Button color="secondary" className="float-right" onClick={() => {this.close()}}>Close</Button>
                            </div>
                        </ModalFooter>
                    </Modal>
            </div>
        );
    }

}

export default PaymentModal;