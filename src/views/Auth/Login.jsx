import React from "react";
import APIClient from "../../api/APIClient"

import {
  Card, CardLink, CardBody, CardHeader, Col, Row, Container, Form, FormGroup, Label, Input, Button, Alert
} from "reactstrap";
import UsersAPI from "../../api/UsersAPI";

import Cookies from "universal-cookie";
const cookies = new Cookies();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      invalid: false
    }

    const client = new APIClient()
    client.checkAuthentication().then(() => {
      const { history } = this.props;
      history.replace("/")
    }).catch(() => {
      console.log("User Not Logged In")
    })
  }

  handleEmailChange(event) {
    this.setState({
      username: event.target.value
    })
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    })
  }

  submitForm(event) {
      event.preventDefault()
      var client = new APIClient();
      client.login(this.state.username, this.state.password).then(result =>{
          let userClient = new UsersAPI();
          let promises=[userClient.getUserRole(this.state.username), userClient.getUserPermissions(this.state.username)]
          Promise.all(promises).then(result => {
              let role = result[0]
              let permissions = result[1]
              cookies.set("role", role, { path: '/' })
              cookies.set("permissions", permissions, { path: '/' })
              const { history } = this.props;
              history.replace("/")
          }).catch(e => {
              console.log("Error loading user details: ")
              console.log(e)
              cookies.remove("accessToken")
          })
      }).catch(() => {
          this.setState({
              password: "",
              invalid: true
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
                      <h2 style={{textAlign: "center", color: "white"}}>Login to Otter Pond</h2>
                    </CardHeader>
                    <CardBody>
                      <Form onSubmit={ (e) => this.submitForm(e) }>
                        <Alert color="warning" isOpen={this.state.invalid}>
                          Invalid Username/Password
                        </Alert>
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
                        <FormGroup>
                          <Label for="examplePassword" style={{color: "white"}}>Password</Label>
                          <Input type="password"
                                 name="password"
                                 id="password"
                                 placeholder="password"
                                 style={{color: "white"}}
                                 value={this.state.password}
                                 onChange={(e) => this.handlePasswordChange(e)}
                          />
                        </FormGroup>
                        <Button style={{textAlign: "center"}} block>Log In</Button>
                        {/*How do I space this out??? Or center it???*/}
                        <Row>
                          <Col>
                            <CardLink style={{color: "white"}} href="#/auth/reset">Reset Password</CardLink>
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

export default Login;
