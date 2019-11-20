import React from "react";
import {Col, Container, Row} from "reactstrap";
import ProfileCard from "../../components/ProfileSettings/ProfileCard";
import SettingsCard from "../../components/ProfileSettings/SettingsCard";


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
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <SettingsCard />
                            </Col>
                        </Row>
                </div>
            </>
        );
    }
}

export default ProfileSettings;
