import React from "react";

import {
  Card, CardBody, CardHeader, Col, Row, Container,
} from "reactstrap";
import { Link } from 'react-router-dom';

class VerifySuccess extends React.Component {

  render() {
    return (
        <>
          <div style={{marginTop: "100px"}}>
            <Container>
              <Row>
                <Col sm={{size: 10, offset: 1}} md={{ size: 4, offset: 4 }}>
                  <Card data="blue"  style={{background: "linear-gradient(0deg,#3358f4,#1d8cf8)"}}>
                    <CardHeader>
                      <h2 style={{textAlign: "center", color: "white"}}>Successfully Verified Email</h2>
                    </CardHeader>
                    <CardBody className="text-center">
                      <h3>Thank you for verifying your email address! You can either close this window or click <Link to="/auth/login">here</Link> to log in</h3>
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

export default VerifySuccess;
