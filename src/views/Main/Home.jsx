import React from "react";
import {Col, Row} from "reactstrap";
import CalendarCard from "../../components/Home/CalendarCard";

// reactstrap components

class Home extends React.Component {
    render() {
        return (
            <>
                <div className="content">
                    <h1>Welcome to the Otter Pond</h1>
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
