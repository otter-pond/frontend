import React, { Component } from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
} from "reactstrap"

class EditEmailListsCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h2" className="float-left">Edit Email Lists</CardTitle>
                </CardHeader>
                <CardBody>
                    <div>

                    </div>
                </CardBody>
            </Card>

        );
    }
}

export default EditEmailListsCard;
