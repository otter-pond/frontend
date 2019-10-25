import {Elements} from "react-stripe-elements";
import React, {Component} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import Verify from "./Verify.jsx"
import PaymentAPI from "../../api/PaymentAPI";
import LoadingOverlay from "react-loading-overlay";

class PaymentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "",
            loading: false
        }

        this.paymentApi = new PaymentAPI()
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
                        bankName: status["bankName"],
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
            this.checkAccountStatus()
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
                                        <Verify postVerify={() => {this.checkAccountStatus()}}/>
                                    </Elements>
                                :
                                <p>Account exists</p>
                                }

                            </ModalBody>
                        </LoadingOverlay>

                        <ModalFooter>
                            <Button color="secondary" onClick={() => {this.close()}}>Close</Button>
                        </ModalFooter>
                    </Modal>
            </div>
        );
    }

}

export default PaymentModal;