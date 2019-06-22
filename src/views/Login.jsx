import React from "react";


import {
    Card, CardBody, CardHeader, Col, Row, Container, Form, FormGroup, Label, Input, Button
} from "reactstrap";

class Login extends React.Component {
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
                                        <Form>
                                            <FormGroup>
                                                <Label for="exampleEmail" style={{color: "white"}}>Email</Label>
                                                <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder"  style={{color: "white"}}/>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="examplePassword" style={{color: "white"}}>Password</Label>
                                                <Input type="password" name="password" id="examplePassword" placeholder="password placeholder"  style={{color: "white"}}/>
                                            </FormGroup>
                                            <Button style={{textAlign: "center"}}>Submit</Button>
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
