import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col} from "reactstrap";

class MemberDetailsModal extends Component {
    constructor(props) {
        super(props);
    }

    close() {
        if (this.props.close) {
            this.props.close()
        }
    }

    getBirthday(user){
        if (user["birthday"] === null || user["birthday" === ""]) {
            return ""
        }
        try{
            let birthday = new Date(user["birthday"])
            return birthday.toLocaleDateString();
        } catch {
            return ""
        }
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} backdrop={true} toggle={() => {this.close()}}>
                    <ModalHeader tag={"h2"}>Member Details</ModalHeader>
                    <ModalBody>
                        {this.props.user ?
                            <>
                                <Row>
                                    <Col md={4}>
                                        <p style={{fontWeight: "bold"}}>First Name:</p>
                                    </Col>
                                    <Col md={8} className={"text-right"}>
                                        <p>{this.props.user["first_name"]}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <p style={{fontWeight: "bold"}}>Middle Name</p>
                                    </Col>
                                    <Col md={8} className={"text-right"}>
                                        <p>{this.props.user["middle_name"]}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <p style={{fontWeight: "bold"}}>Last Name</p>
                                    </Col>
                                    <Col md={8} className={"text-right"}>
                                        <p>{this.props.user["last_name"]}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <p style={{fontWeight: "bold"}}>Birthday</p>
                                    </Col>
                                    <Col md={8} className={"text-right"}>
                                        <p>{this.getBirthday(this.props.user)}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <p style={{fontWeight: "bold"}}>Major</p>
                                    </Col>
                                    <Col md={8} className={"text-right"}>
                                        <p>{this.props.user["major"]}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <p style={{fontWeight: "bold"}}>Phone Number</p>
                                    </Col>
                                    <Col md={8} className={"text-right"}>
                                        <p><a href={"tel:" + this.props.user["phone_number"]}>{this.props.user["phone_number"]}</a></p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <p style={{fontWeight: "bold"}}>Emails</p>
                                    </Col>
                                    <Col md={8} className={"text-right"}>
                                        <p><a href={"mailto:" + this.props.user["user_email"]}>{this.props.user["user_email"]}</a> (Primary)</p>
                                    </Col>
                                </Row>
                                {this.props.user["other_emails"] && this.props.user["other_emails"].map((email, index) => {
                                    return <Row key={index}>
                                        <Col md={4}>
                                        </Col>
                                        <Col md={8} className={"text-right"}>
                                            <p><a href={"mailto:" + email}>{email}</a></p>
                                        </Col>
                                    </Row>
                                })}
                            </>
                        :
                        null}
                    </ModalBody>
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

export default MemberDetailsModal;