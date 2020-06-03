import React from "react";

import {
  Card, CardLink, CardBody, CardHeader, Col, Row, Container, Form, FormGroup, Label, Input, Button, Alert
} from "reactstrap";

class ChangePasswordCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      passwordMismatch: false,
      passwordsEmpty: false,
      resetSuccess: false,
      networkError: false
    }
  }

  handleCurrentPasswordChange(event) {
    this.setState({
      currentPassword: event.target.value
    });
  }

  handleNewPasswordChange(event) {
    this.setState({
      newPassword: event.target.value
    });
  }

  handleConfirmNewPasswordChange(event) {
    this.setState({
      confirmNewPassword: event.target.value
    });
  }

  resetStateStatusFlags() {
    this.setState({
      passwordMismatch: false,
      passwordsEmpty: false,
      resetSuccess: false,
      networkError: false
    });
  }

  submitForm(event) {
    console.log("submit change password form");
    event.preventDefault();
    this.resetStateStatusFlags();

    if (!this.state.newPassword && !this.state.confirmNewPassword) {
      this.setState({
        passwordsEmpty: true
      });
    } else if (this.state.newPassword !== this.state.confirmNewPassword ||
        !this.state.newPassword ||
        !this.state.confirmNewPassword) {
      this.setState({
        passwordMismatch: true,
      });
    } else {
      // DO the password change
    }
  }

  render() {
    return (
      <Card>
        <CardHeader>
          <h2>Change Password</h2>
        </CardHeader>
        <CardBody>
          <Form onSubmit={ (e) => this.submitForm(e) }>
            <FormGroup>
              <Label for="currentPassword">Current Password</Label>
              <Input 
                type="password"
                name="currentPassword"
                id="currentPassword"
                placeholder="Current Password"
                value={this.state.currentPassword}
                onChange={(e) => this.handleCurrentPasswordChange(e)}/>
            </FormGroup>
            <FormGroup>
              <Label for="newPassword">New Password</Label>
              <Input 
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="New Password"
                value={this.state.newPassword}
                onChange={(e) => this.handleNewPasswordChange(e)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="confirmNewPassword">Confirm New Password</Label>
              <Input 
                type="password"
                name="confirmNewPassword"
                id="confirmNewPassword"
                placeholder="Confirm Password"
                value={this.state.confirmNewPassword}
                onChange={(e) => this.handleConfirmNewPasswordChange(e)}
              />
            </FormGroup>
            <Alert color="success" isOpen={this.state.resetSuccess}>
              Change successful!
            </Alert>
            <Alert color="danger" isOpen={this.state.networkError}>
              Change failed: could not reach server
            </Alert>
            <Alert color="warning" isOpen={this.state.passwordsEmpty}>
              Passwords are empty
            </Alert>
            <Alert color="warning" isOpen={this.state.passwordMismatch}>
              Passwords do not match
            </Alert>
            <div className="text-right">
              <Button type="submit">Save</Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export default ChangePasswordCard;
