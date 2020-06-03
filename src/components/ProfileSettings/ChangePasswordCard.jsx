import React, { Component } from "react";
import {
  Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, Alert
} from "reactstrap";
import UsersAPI from "../../api/UsersAPI";

class ChangePasswordCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      passwordWrong: false,
      passwordMismatch: false,
      passwordsEmpty: false,
      changeSuccess: false,
      networkError: false,
    };

    this.usersApi = new UsersAPI();
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
      changeSuccess: false,
      networkError: false
    });
  }

  submitForm(event) {
    // TODO: verify password meets certain criteria (> certain length, etc.)
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
      this.usersApi.changeUserPassword(this.state.currentPassword, this.state.newPassword)
      .then(result => {
        if (result.error === "Success") {
          this.setState({
            changeSuccess: true
          });
        } else {
          this.setState({
            passwordWrong: true
          })
        }
      }).catch(err => {
        this.setState({
          networkError: true
        });
      });
    }
    this.setState({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  }

  render() {
    return (
      <Card>
        <CardHeader>
          <h2>Change Password</h2>
        </CardHeader>
        <CardBody>
          <Form onSubmit={ (e) => this.submitForm(e) }>
            <Alert color="success" isOpen={this.state.changeSuccess}>
              Change successful!
            </Alert>
            <Alert color="danger" isOpen={this.state.networkError}>
              Change failed: could not reach server
            </Alert>
            <Alert color="danger" isOpen={this.state.passwordWrong}>
              Change failed: current password entered incorrectly
            </Alert>
            <Alert color="warning" isOpen={this.state.passwordsEmpty}>
              Passwords are empty
            </Alert>
            <Alert color="warning" isOpen={this.state.passwordMismatch}>
              Passwords do not match
            </Alert>
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
