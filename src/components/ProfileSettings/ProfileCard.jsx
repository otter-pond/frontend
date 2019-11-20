import React, { Component } from "react";
import LoadingOverlay from 'react-loading-overlay';

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Container, Label,
    Input, FormGroup, InputGroup, InputGroupAddon, InputGroupButton, Button, Form, Alert
} from "reactstrap"
import UsersAPI from "../../api/UsersAPI";

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userEmail: "",
            lastName: "",
            firstName: "",
            middleName: "",
            birthday: "",
            phoneNumber: "",
            major: ""
        }

        this.usersApi = new UsersAPI()

    }

    componentDidMount() {
        this.loadUser()
    }

    loadUser() {
        this.setState({
            loading: true
        }, () => {
            this.usersApi.getCurrentUser().then(user => {
                this.setState({
                    loading: false,
                    userEmail: user["user_email"],
                    firstName: user["first_name"],
                    middleName: user["middle_name"],
                    lastName: user["last_name"],
                    birthday: user["birthday"],
                    phoneNumber: user["phone_number"],
                    major: user["major"],
                    success: false
                })
            })
        })

    }

    submit(e) {
        e.preventDefault();
        let user = {
            first_name: this.state.firstName,
            middle_name: this.state.middleName,
            last_name: this.state.lastName,
            birthday: this.state.birthday,
            phone_number: this.state.phoneNumber,
            major: this.state.major
        }

        this.setState({
            loading: true
        }, () => {
            this.usersApi.updateUser(this.state.userEmail, user).then(() => {
                this.setState({
                    loading: false,
                    success: true
                })
            })
        })
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h2" className="float-left">User Profile</CardTitle>
                </CardHeader>
                <CardBody>
                    <Alert color="success" isOpen={this.state.success} toggle={() => {this.setState({success: false})}}>
                        Successfully updated user profile.
                    </Alert>
                    <Container>
                        <LoadingOverlay
                            active={this.state.loading}
                            spinner
                            text='Loading...'
                        >
                            <Form onSubmit={(e) => {this.submit(e)}} class="needs-validation" >
                                <FormGroup>
                                    <Label for="lastName">First Name</Label>
                                    <Input type="text"
                                           name="lastName"
                                           placeholder={"First Name"}
                                           value={this.state.firstName}
                                           onChange={(e) => {this.setState({firstName: e.target.value})}}
                                           required/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="middleName">Middle Name</Label>
                                    <Input type="text"
                                           name="middleName"
                                           placeholder={"Middle Name"}
                                           value={this.state.middleName}
                                           onChange={(e) => {this.setState({middleName: e.target.value})}}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="lastName">Last Name</Label>
                                    <Input type="text"
                                           name="lastName"
                                           placeholder={"Last Name"}
                                           value={this.state.lastName}
                                           onChange={(e) => {this.setState({lastName: e.target.value})}}
                                           required/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="birthday">Birthday</Label>
                                    <Input type="date"
                                           name="birthday"
                                           placeholder={"01/01/1900"}
                                           value={this.state.birthday}
                                           onChange={(e) => {this.setState({birthday: e.target.value})}}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="phoneNumber">Phone Number</Label>
                                    <Input type="tel"
                                           name="phoneNumber"
                                           placeholder={"000-000-0000"}
                                           value={this.state.phoneNumber}
                                           onChange={(e) => {this.setState({phoneNumber: e.target.value})}}
                                           pattern="^\d{3}-\d{3}-\d{4}$"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="major">Major</Label>
                                    <Input type="text"
                                           name="major"
                                           placeholder={"Computer Science"}
                                           value={this.state.major}
                                           onChange={(e) => {this.setState({major: e.target.value})}}/>
                                </FormGroup>
                                <div className="text-right">
                                    <Button type="submit">Save</Button>
                                </div>
                            </Form>
                        </LoadingOverlay>

                    </Container>
                </CardBody>
            </Card>

        );
    }
}

export default ProfileCard;
