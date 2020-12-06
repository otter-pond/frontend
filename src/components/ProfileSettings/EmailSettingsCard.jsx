import React, { Component } from "react";
import LoadingOverlay from 'react-loading-overlay';

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle, Form, FormGroup, Input, Label,
    Row, Col, Alert
} from "reactstrap"
import UsersAPI from "../../api/UsersAPI";
import EmailListAPI from "../../api/EmailListAPI";
import Notify from "react-notification-alert";

class EmailSettingsCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userEmail: "",
            otherEmails: [],
            success: false,
            verificationSuccess: false
        }

        this.usersApi = new UsersAPI()
        this.emailApi = new EmailListAPI();
    }

    componentDidMount() {
        this.loadUser()
    }

    loadUser() {
        this.setState({
            loading: true
        }, () => {
            this.usersApi.getCurrentUser().then(user => {
                let emails = user["other_emails"].map(email => {
                    return {
                        address: email,
                        verificationStatus: null
                    }
                });
                let primary = {
                    address: user["user_email"],
                    verificationStatus: null
                }
                let promises = []
                for (let index in emails) {
                    promises.push(this.emailApi.checkVerification(emails[index].address))
                }
                promises.push(this.emailApi.checkVerification(primary.address))
                Promise.all(promises).then(results => {
                    for (let index in results) {
                        if (index < emails.length) {
                            emails[index].verificationStatus = results[index]
                        } else {
                            primary.verificationStatus = results[index]
                        }
                    }
                    this.setState({
                        loading: false,
                        userEmail: primary,
                        otherEmails: emails,
                        success: false
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

    updateEmail(index, value) {
        let emails = this.state.otherEmails
        emails[index].address = value
        emails[index].verificationStatus = null
        this.setState({
            otherEmails: emails
        })
    }

    deleteEmail(email) {
        let emails = this.state.otherEmails.filter(a => {return a.address !== email.address})
        this.setState({
            otherEmails: emails
        })
    }

    addEmail() {
        let emails = this.state.otherEmails
        emails.push({
            address: "",
            verificationStatus: null
        })
        this.setState({
            otherEmails: emails
        })
    }

    verifyEmail(email) {
        this.emailApi.requestVerification(email).then(() => {
            this.setState({
                verificationSuccess: true
            })
        })
    }

    submitEmails(e) {
        e.preventDefault()

        let user = {
            other_emails: this.state.otherEmails.map(a => {return a.address})
        }

        this.setState({
            loading: true
        }, () => {
            this.usersApi.updateUser(this.state.userEmail.address, user).then(() => {
                this.loadUser()
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
            <Card>
                <Notify ref="notify"/>
                <CardHeader>
                    <CardTitle tag="h2" className="float-left">Email Addresses</CardTitle>
                </CardHeader>
                <CardBody>
                    <Alert color="success" isOpen={this.state.verificationSuccess} toggle={() => {this.setState({verificationSuccess: false})}}>
                        Successfully sent verification email
                    </Alert>
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    >
                        <Form onSubmit={(e) => {this.submitEmails(e)}} class="needs-validation" >
                            <FormGroup>
                                <Label for="primaryEmail">Primary Email</Label>
                                <Row>
                                    <Col xs={8}>
                                        <Input type="email"
                                               name="primaryEmail"
                                               placeholder={"email@theotterpond.com"}
                                               value={this.state.userEmail.address}
                                               disabled/>
                                    </Col>
                                    <Col xs={4}>
                                        {this.state.userEmail.verificationStatus === false &&
                                        <Button color={"success"}
                                                size={"sm"}
                                                onClick={() => {this.verifyEmail(this.state.userEmail.address)}}>Verify</Button>}
                                    </Col>
                                </Row>

                            </FormGroup>

                            <FormGroup>
                                <Label for="otherEmails">Other Emails</Label>
                                {this.state.otherEmails.map((email, index) => {
                                    return <Row style={{marginBottom: 10}}>
                                        <Col xs={8}>
                                            <Input type="email"
                                                   name={"email" + index}
                                                   placeholder={"email@theotterpond.com"}
                                                   value={email.address}
                                                   onChange={(e) => {this.updateEmail(index, e.target.value)}}
                                                   required/>
                                        </Col>
                                        <Col xs={4}>
                                            {email.verificationStatus === false &&
                                            <Button color={"success"}
                                                    size={"sm"}
                                                    onClick={() => {this.verifyEmail(email.address)}}>Verify</Button>
                                            }
                                            <Button color={"danger"}
                                                    size={"sm"}
                                                    onClick={() => {this.deleteEmail(email)}}>Delete</Button>
                                        </Col>
                                    </Row>
                                })}
                                <Button size={"sm"}
                                        onClick={() => {this.addEmail()}}>Add Another Email</Button>

                            </FormGroup>

                            <div className="text-right">
                                <Button type="submit">Save</Button>
                            </div>
                        </Form>
                    </LoadingOverlay>
                </CardBody>
            </Card>
        );
    }
}

export default EmailSettingsCard;
