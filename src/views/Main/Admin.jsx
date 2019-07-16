import React from "react";

import EditRosterCard from "../../components/Admin/EditRosterCard";
import EditEmailListsCard from "../../components/Admin/EditEmailListsCard";

// reactstrap components
import {
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
                            <EditEmailListsCard />
                        </Col>
                    </Row>
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
