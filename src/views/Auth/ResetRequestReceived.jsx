import React from "react";
import APIClient from "../../api/APIClient"

import {
  Card, CardLink, CardBody, CardSubtitle, CardHeader, Col, Row, Container, Form, FormGroup, Label, Input, Button
} from "reactstrap";

class ResetRequestReceived extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    const client = new APIClient()
    client.checkAuthentication().then(() => {
      const { history } = this.props;
      history.replace("/")
    }).catch(() => {
      console.log("User Not Logged In")
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
                        Your reset request has been received. Check your email for further instructions!
                      </CardSubtitle>
                      <Row>
                        <Col>
                          <CardLink style={{color: "white"}} href="#/auth/login">Back to Log in</CardLink>
                        </Col>
                      </Row>
                      <CardLink style={{color: "white"}} href="#/auth/resetPassword">Already have a reset code?</CardLink>
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

export default ResetRequestReceived;
