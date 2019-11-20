import React, { Component } from "react";
import LoadingOverlay from 'react-loading-overlay';

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
} from "reactstrap"

class SettingsCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }



    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h2" className="float-left">Settings</CardTitle>
                </CardHeader>
                <CardBody>
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    >
                        <Row>

                        </Row>
                    </LoadingOverlay>
                </CardBody>
            </Card>

        );
    }
}

export default SettingsCard;
