import React from "react";
import {Col, Container, Row} from "reactstrap";
import ProfileCard from "../../components/ProfileSettings/ProfileCard";
import EmailSettingsCard from "../../components/ProfileSettings/EmailSettingsCard";
import ListSubscriptionsCard from "../../components/ProfileSettings/ListSubscriptionsCard";


class ProfileSettings extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="content">
                    <h1>Profile and Settings</h1>
                        <Row>
                            <Col md={6}>
                                <ProfileCard />
                                <EmailSettingsCard />
                            </Col>
                            <Col md={6}>
                                <ListSubscriptionsCard />
                            </Col>
                        </Row>
                </div>
            </>
        );
    }
}

export default ProfileSettings;
