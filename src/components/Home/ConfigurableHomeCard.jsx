import React, { Component } from "react";

import {
    Row,
    Col, Modal, ModalHeader, ModalBody, Alert, Form, FormGroup, Label, Input, ModalFooter,
} from "reactstrap"
import Button from "reactstrap/es/Button";
import Cookies from "universal-cookie";
import UsersAPI from "../../api/UsersAPI";
import ConfigAPI from "../../api/ConfigAPI";
import Notify from "react-notification-alert";
import DOMPurify from 'dompurify';

class ConfigurableHomeCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            htmlContent: "",
            isAdmin: false,
            editing: false,
            editingContent: ""
        }

        let cookies = new Cookies();
        let user_email = cookies.get("user_email")
        this.usersApi = new UsersAPI();
        this.configApi = new ConfigAPI();
        this.usersApi.getUserPermissions(user_email).then(permissions => {
            this.setState({
                isAdmin: permissions.includes("full_admin")
            })
        })

        this.configApi.getSetting("homepage_content").then(setting => {
            if (setting != null) {
                this.setState({
                    htmlContent: setting["value"]
                })
            }
        }).catch(e => {
            var options = {
                place: "tc",
                message: `Error executing request`,
                type: "danger",
                autoDismiss: -1,
                closeButton: true
            };
            this.refs.notify.notificationAlert(options);
        })
    }

    saveContent() {
        let setting = {
            "identifier": "homepage_content",
            "value": DOMPurify.sanitize(this.state.editingContent),
            "description": "Html for homepage",
            "permissions": []
        }
        this.configApi.saveSetting(setting).then(() => {
            this.setState({
                htmlContent: setting["value"],
                editing: false,
                editinContent: ""
            })
        }).catch(e => {
            var options = {
                place: "tc",
                message: `Error executing request`,
                type: "danger",
                autoDismiss: -1,
                closeButton: true
            };
            this.refs.notify.notificationAlert(options);
        })
    }

    render() {
        return (
            <div>
                <Notify ref="notify"/>
                <Row>
                    <Col md={12}>
                        {this.state.isAdmin &&
                        <Button className={"float-right"} onClick={(e) => {this.setState({
                            editing: true,
                            editingContent: this.state.htmlContent
                        })}}>
                            Edit Homepage Content
                        </Button>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        {this.state.htmlContent !== "" &&
                        <div dangerouslySetInnerHTML={{ __html: this.state.htmlContent }} />
                        }
                    </Col>
                </Row>
                <Modal isOpen={this.state.editing} backdrop={true}>
                    <ModalHeader tag={"h2"}>Edit Content</ModalHeader>
                    <ModalBody >
                        <Input type={"textarea"} value={this.state.editingContent} onChange={(e) => {
                            this.setState({
                                editingContent: e.target.value
                            })
                        }}/>
                    </ModalBody>
                    <ModalFooter>
                        <div className="clearfix" style={{width: "100%"}}>
                            <Button color="secondary"
                                    className="float-right"
                                    onClick={() => {this.saveContent()}}
                                    style={{marginLeft: "10px"}}
                            >Save Homepage Content</Button>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>


        );
    }
}

export default ConfigurableHomeCard;
