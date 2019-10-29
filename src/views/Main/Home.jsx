import React from "react";
import {Button, Col, Row} from "reactstrap";
import CalendarCard from "../../components/Home/CalendarCard";

// reactstrap components

class Home extends React.Component {
    render() {
        return (
            <>
                <div className="content">
                    <h1>Welcome to the Otter Pond</h1>
                    <p>Don't judge, this is very much a work in progress</p>
                    <Row>
                        <Col xs={12}>
                            <CalendarCard />
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default Home;
