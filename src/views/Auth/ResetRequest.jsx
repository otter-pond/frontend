import React from "react";
import APIClient from "../../api/APIClient"

import {
  Card, CardLink, CardBody, CardSubtitle, CardHeader, Col, Row, Container, Form, FormGroup, Label, Input, Button
} from "reactstrap";

class ResetRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      requestSent: false
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
      email: event.target.value
    })
  }

  submitForm(event) {
    console.log("submit form")
    event.preventDefault()

    var client = new APIClient();
    client.requestResetPassword(this.state.email).then(() =>{
      console.log("reset password request succeeded")
    }).catch(() => {
      console.log("reset password request failed")
    }).finally( () => {
      // No matter what, always go to request received page. Doesn't tell people what is a valid email!
      this.setState({
        requestSent: true
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
                      <h2 style={{textAlign: "center", color: "white"}}>Reset Request</h2>
                    </CardHeader>
                    <CardBody>
                      <CardSubtitle>
                      </CardSubtitle>
                      <Form onSubmit={ (e) => this.submitForm(e) }>
                        {this.state.requestSent && <p style={{color: "white"}}>Your reset request has been received. Check your email for further instructions!</p>}
                        <FormGroup>
                          <Label for="exampleEmail" style={{color: "white"}}>Enter your email address</Label>
                          <Input type="email"
                                 name="email"
                                 id="email"
                                 placeholder="email"
                                 style={{color: "white"}}
                                 value={this.state.email}
                                 onChange={(e) => this.handleEmailChange(e)}/>
                        </FormGroup>
                        <Button style={{textAlign: "center"}} block>Request</Button>
                        {/*How do I space this out??? Or center it???*/}
                        <Row>
                          <Col>
                            <CardLink style={{color: "white"}} href="#/auth/login">Back to Log in</CardLink>
                          </Col>
                        </Row>
                        {/*<CardLink style={{color: "white"}} href="#/auth/resetPassword">Already have a reset code?</CardLink>*/}
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

export default ResetRequest;
