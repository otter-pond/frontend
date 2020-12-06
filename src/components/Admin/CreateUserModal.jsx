import React, { Component } from "react";
import {Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Multiselect} from "multiselect-react-dropdown";
import RolesAPI from "../../api/RolesAPI";
import UsersAPI from "../../api/UsersAPI";
import Notify from "react-notification-alert";

class CreateUserModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastName: "",
            firstName: "",
            middleName: "",
            userEmail: "",
            phoneNumber: "",
            role: "",
            allRoles: [],
            showInvalidFormError: false
        }

        this.rolesApi = new RolesAPI();
        this.usersApi = new UsersAPI();

        this.rolesApi.getRoles().then(roles => {
            this.setState({
                allRoles: roles
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
    }

    saveUser() {
        if (this.state.lastName === "" ||
            this.state.firstName === "" ||
            this.state.userEmail === "" ||
            this.state.role === "") {
            this.setState({
                showInvalidFormError: true
            })
            return;
        } else {
            let user = {
                last_name: this.state.lastName,
                first_name: this.state.firstName,
                middle_name: this.state.middleName,
                user_email: this.state.userEmail,
                phone_number: this.state.phoneNumber,
                role_id: this.state.role
            }

            this.usersApi.createUser(user).then(() => {
                this.props.cancel()
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
        }
    }

    cancel() {
        this.setState({
            lastName: "",
            firstName: "",
            middleName: "",
            userEmail: "",
            phoneNumber: "",
            role: ""
        }, () => {
            this.props.cancel()
        });

    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} backdrop={true}>
                <ModalHeader tag={"h2"}>Create New User</ModalHeader>
                <ModalBody>
                    <Alert color="danger" isOpen={this.state.showInvalidFormError} toggle={() => {this.setState({showInvalidFormError: !this.state.showInvalidFormError})}}>
                        First name, last name, email and role are all required fields
                    </Alert>
                    <Form>
                        <FormGroup>
                            <Label>First Name*</Label>
                            <Input type={"text"}
                                   value={this.state.firstName}
                                   required={true}
                                   onChange={(e) => {this.setState({firstName: e.target.value})}}
                                    />
                        </FormGroup>
                        <FormGroup>
                            <Label>Middle Name</Label>
                            <Input type={"text"}
                                   value={this.state.middleName}
                                   required={true}
                                   onChange={(e) => {this.setState({middleName: e.target.value})}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Last Name*</Label>
                            <Input type={"text"}
                                   value={this.state.lastName}
                                   onChange={(e) => {this.setState({lastName: e.target.value})}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Email*</Label>
                            <Input type={"text"}
                                   value={this.state.userEmail}
                                   required={true}
                                   onChange={(e) => {this.setState({userEmail: e.target.value})}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Phone Number</Label>
                            <Input type={"tel"}
                                   value={this.state.phoneNumber}
                                   required={true}
                                   onChange={(e) => {this.setState({phoneNumber: e.target.value})}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Role</Label>
                            <Input type="select"
                                   name="select"
                                   value={this.state.role}
                                   onChange={(e) => {
                                       this.setState({role: e.target.value})}
                                   }>
                                <option value={""}>Select Role</option>
                                {this.state.allRoles.map((role, key) => {
                                    return <option value={role["role_id"]} key={key}>{role["role_description"]}</option>
                                })}
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <div className="clearfix" style={{width: "100%"}}>
                        <Button color="secondary"
                                className="float-right"
                                onClick={() => {this.saveUser()}}
                                style={{marginLeft: "10px"}}
                        >Save User</Button>
                        <Button color="secondary"
                                className="float-right"
                                onClick={() => {this.cancel()}}
                        >Cancel</Button>
                    </div>
                </ModalFooter>
                <Notify ref="notify"/>
            </Modal>
        );
    }
}

export default CreateUserModal;
