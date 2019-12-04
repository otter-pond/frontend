import React from "react";
import {Col, Container, Row} from "reactstrap";
import MemberListCard from "../../components/Members/MemberListCard";


class Members extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="content">
                    <h1>Members</h1>
                    <Row>
                        <Col md={12}>
                            <MemberListCard />
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default Members;
