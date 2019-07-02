import React from "react";

import EditRosterCard from "../../components/Admin/EditRosterCard";

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
} from "reactstrap";

class Admin extends React.Component {
    render() {
        return (
            <>
                <div className="content">
                    <h1>Admin</h1>
                    <Row>
                        <Col xs={12}>
                            <EditRosterCard />
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default Admin;
