import React from "react";
import {Button, Col, Row} from "reactstrap";
import CalendarCard from "../../components/Home/CalendarCard";
import PaymentModal from "../../components/Payment/PaymentModal";

// reactstrap components

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modal: false
        }
    }

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
                    <Button onClick={() => {this.setState({modal: true})}}>Payment</Button>
                    <PaymentModal isOpen={this.state.modal} toggle={() => {this.setState({modal: !this.state.modal})}}/>
                </div>
            </>
        );
    }
}

export default Home;
