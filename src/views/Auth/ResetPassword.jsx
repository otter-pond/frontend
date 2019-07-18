import React from "react";
import APIClient from "../../api/APIClient"
import qs from 'query-string'

import {
  Card, CardLink, CardBody, CardHeader, Col, Row, Container, Form, FormGroup, Label, Input, Button
} from "reactstrap";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
    this.state = {
      email: "",
      newPassword: "",
      confirmNewPassword: "",
      resetToken: query.token,
      passwordMismatch: false,
      passwordsEmpty: false,
      resetSuccess: false,
      resetError: false
    }

    const client = new APIClient()
    client.checkAuthentication().then(() => {
      const { history } = this.props;
      history.replace("/")
    }).catch(() => {
      console.log("User Not Logged In")
    })

    console.log(this.state.resetToken)
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    })
  }

  handleNewPasswordChange(event) {
    this.setState({
      newPassword: event.target.value
    })
  }

  handleConfirmNewPasswordChange(event) {
    this.setState({
      confirmNewPassword: event.target.value
    })
  }

  resetStateStatusFlags() {
    this.setState({
      passwordMismatch: false,
      passwordsEmpty: false,
      resetSuccess: false,
      resetError: false
    })
  }


  //TODO: Temporary behavior to always reset to login screen
  submitForm(event) {
    console.log("submit reset password form")
    event.preventDefault()
    this.resetStateStatusFlags()

    if (!this.state.newPassword && !this.state.confirmNewPassword) {
      this.setState({
        passwordsEmpty: true
      })
      return
    } else if (this.state.newPassword !== this.state.confirmNewPassword ||
        !this.state.newPassword ||
        !this.state.confirmNewPassword) {
      this.setState({
        passwordMismatch: true,
      })
      return
    }

    var client = new APIClient();
    client.resetPassword(this.state.email, this.state.newPassword, this.state.resetToken).then(() =>{
      this.setState({
        resetSuccess: true
      })
    }).catch(() => {
      this.setState({
        resetError: true
      })
    })
  }

  render() {
    return (
        <>
          <div style={{marginTop: "100px"}}>
            <Container>
              <Row>
                <Col sm={{size: 10, offset: 1}} md={{ size: 4, offset: 4 }}>
                  <Card data="blue"  style={{background: "linear-gradient(0deg,#3358f4,#1d8cf8)"}}>
                    <CardHeader>
                      <h2 style={{textAlign: "center", color: "white"}}>Reset Password</h2>
                    </CardHeader>
                    <CardBody>
                      <Form onSubmit={ (e) => this.submitForm(e) }>
                        {this.state.resetSuccess && <p style={{color: "white"}}>Reset successful, please return to login page!</p>}
                        {this.state.resetError && <p style={{color: "white"}}>Reset failed, check your email address and try again!</p>}
                        <FormGroup>
                          <Label for="exampleEmail" style={{color: "white"}}>Email</Label>
                          <Input type="email"
                                 name="email"
                                 id="email"
                                 placeholder="email"
                                 style={{color: "white"}}
                                 value={this.state.email}
                                 onChange={(e) => this.handleEmailChange(e)}/>
                        </FormGroup>
                        {this.state.passwordsEmpty && <p style={{color: "white"}}>Passwords are empty</p>}
                        {this.state.passwordMismatch && <p style={{color: "white"}}>Passwords do not match</p>}
                        <FormGroup>
                          <Label for="newPassword" style={{color: "white"}}>New Password</Label>
                          <Input type="password"
                                 name="newPassword"
                                 id="newPassword"
                                 placeholder="password"
                                 style={{color: "white"}}
                                 value={this.state.newPassword}
                                 onChange={(e) => this.handleNewPasswordChange(e)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="confirmNewPassword" style={{color: "white"}}>Confirm New Password</Label>
                          <Input type="password"
                                 name="confirmNewPassword"
                                 id="confirmNewPassword"
                                 placeholder="confirm password"
                                 style={{color: "white"}}
                                 value={this.state.confirmNewPassword}
                                 onChange={(e) => this.handleConfirmNewPasswordChange(e)}
                          />
                        </FormGroup>
                        <Button style={{textAlign: "center"}}>Submit</Button>
                        {/*How do I space this out??? Or center it???*/}
                        <Row>
                          <Col>
                            <CardLink style={{color: "white"}} href="#/auth/Login">Return to Login</CardLink>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </>
    );
  }
}

export default ResetPassword;
