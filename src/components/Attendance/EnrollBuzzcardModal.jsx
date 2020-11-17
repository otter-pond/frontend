import React, { Component } from "react";
import {Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import UsersAPI from "../../api/UsersAPI";
import { Typeahead } from 'react-bootstrap-typeahead';


class EnrollBuzzcardModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidGtid: false,
            gtid: "",
            selectedUsers: [],
            error: false,
            selectUser: false
        }
        this.usersApi = new UsersAPI();
    }

    enroll() {
        if (this.state.gtid.length !== 9) {
            this.setState({invalidGtid: true})
            return
        }
        if (this.state.selectedUsers.length === 0) {
            this.setState({selectUser: true})
            return;
        }
        this.usersApi.enrollBuzzcard(this.state.selectedUsers[0]["id"], this.state.gtid).then(() => {
            this.close();
        }).catch(() => {
            this.setState({error: true})
        })
    }

    close() {
        if (this.props.close)
            this.props.close()
        this.setState({
            invalidGtid: false,
            gtid: "",
            selectedUsers: [],
            error: false,
            selectUser: false
        })
    }


    render() {
        return (
            <Modal isOpen={this.props.isOpen} backdrop={true}>
                <ModalHeader tag={"h2"}>Enroll Buzzcard</ModalHeader>
                <ModalBody>
                    <Alert color="danger" isOpen={this.state.invalidGtid} toggle={() => {this.setState({invalidGtid: !this.state.invalidGtid})}}>
                        Invalid GTID
                    </Alert>
                    <Alert color="danger" isOpen={this.state.error} toggle={() => {this.setState({error: !this.state.error})}}>
                        An error occured
                    </Alert>
                    <Alert color="danger" isOpen={this.state.selectUser} toggle={() => {this.setState({selectUser: !this.state.selectUser})}}>
                        User is required
                    </Alert>
                    <p>Select a user and enter their GTID. Note, GTID's will not actually be stored. They will be hashed and the hash will be stored</p>
                    <Form>
                        <FormGroup>
                            <Label>User</Label>
                            <Typeahead
                                onChange={(selected) => {
                                    this.setState({selectedUsers: selected})
                                }}
                                options={this.props.users.map(user => {
                                    return {id: user["user_email"], label: user["name"]}
                                })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>GTID</Label>
                            <Input type={"text"}
                                   value={this.state.gtid}
                                   required={true}
                                   onChange={(e) => {this.setState({gtid: e.target.value})}}/>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <div className="clearfix" style={{width: "100%"}}>
                        <Button color="secondary"
                                className="float-right"
                                onClick={() => {this.enroll()}}
                                style={{marginLeft: "10px"}}
                        >Enroll Buzzcard</Button>
                        <Button color="secondary"
                                className="float-right"
                                onClick={() => {this.close()}}
                        >Cancel</Button>
                    </div>
                </ModalFooter>
            </Modal>
        );
    }
}

export default EnrollBuzzcardModal;
