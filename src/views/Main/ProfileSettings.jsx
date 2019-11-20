import React from "react";
import {Col, Container, Row} from "reactstrap";
import ProfileCard from "../../components/ProfileSettings/ProfileCard";
import EmailSettingsCard from "../../components/ProfileSettings/EmailSettingsCard";


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
                            <Col xs={6}>
                                <ProfileCard />
                            </Col>
                            <Col xs={6}>
                                <EmailSettingsCard />
                            </Col>
                        </Row>
                </div>
            </>
        );
    }
}

export default ProfileSettings;
