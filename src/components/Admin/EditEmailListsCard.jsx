import React, { Component } from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Container,
    Row,
    Button,
    Alert,
    Col, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Input
} from "reactstrap"
import EmailListAPI from "../../api/EmailListAPI";

class EditEmailListsCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailLists: [],
            selectedListCopy: {},
            selectedList: "None",
            showSuccessAlert: false
        }

        this.emailClient = new EmailListAPI();

        this.refreshLists()
    }

    refreshLists() {
        this.emailClient.getAllLists().then(lists => {
            this.setState({
                emailLists: lists
            })
        }).catch(e => {
            console.log("Unable to load email lists")
        });
    }

    onListSelect(e) {
        let list = this.state.emailLists.filter(a => {return a.address === e.target.value})[0]
        if (!list["subject_prefix"])
            list["subject_prefix"] = ""
        if (!list["description"])
            list["description"] = ""
        this.setState({
            selectedListCopy: Object.create(list),
            selectedList: list.address,
            showSuccessAlert: false
        })
    }

    updateListField(field, newValue){
        let list = this.state.selectedListCopy;
        list[field] = newValue;
        this.setState({
            selectedListCopy: list
        })
    }

    saveListChanges() {
        this.emailClient.updateEmailListDetails(this.state.selectedList, {
            description: this.state.selectedListCopy.description !== "" ? this.state.selectedListCopy.description : null,
            allow_external: this.state.selectedListCopy.allow_external,
            subject_prefix: this.state.selectedListCopy.subject_prefix !== "" ? this.state.selectedListCopy.subject_prefix : null
        }).then((result) => {
            if (result["error"] !== "Success")
                console.log(result["error"])
            else {
                this.setState({
                    showSuccessAlert: true
                })
                this.refreshLists()
            }
        })
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <div className="clearfix">
                        <CardTitle tag="h2" className="float-left">Edit Email List</CardTitle>
                        <div className="float-right">
                            <UncontrolledDropdown>
                                <DropdownToggle>
                                    Selected: {this.state.selectedList}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {this.state.emailLists.map((list, index) => {
                                        return <DropdownItem value={list["address"]}
                                                             key={index}
                                                             onClick={(e) => {this.onListSelect(e)}}>{list["address"]}</DropdownItem>
                                    })}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {this.state.selectedList !== "None" ?
                        this.renderEmailListView(this.state.selectedListCopy) :
                        <h5>Select an email list to edit.</h5>
                    }
                </CardBody>
            </Card>

        );
    }

    renderEmailListView(selectedList) {
        return (
            <Row>
                <Col md={6}>
                    <Container>
                        <Row>
                            <Col xs={6}>
                                <p>Address:</p>
                            </Col>
                            <Col xs={6}>
                                <p>{this.state.selectedListCopy["address"]}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <p>Description:</p>
                            </Col>
                            <Col xs={6}>
                                <p><Input type="text" value={this.state.selectedListCopy["description"]}
                                          onChange={(e) => {this.updateListField("description", e.target.value)}}/></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <p>Subject Prefix:</p>
                            </Col>
                            <Col xs={6}>
                                <p><Input type="text" value={this.state.selectedListCopy["subject_prefix"]}
                                          onChange={(e) => {this.updateListField("subject_prefix", e.target.value)}}/></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <p>Allow External Senders?:</p>
                            </Col>
                            <Col xs={6}>
                                <p><Input type="select" value={this.state.selectedListCopy["allow_external"]}
                                          onChange={(e) => {this.updateListField("allow_external", e.target.value)}}>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </Input></p>
                            </Col>
                        </Row>
                        <Row>
                            <div style={{width: "100%", textAlign: "center"}}>
                                <Button size="sm" onClick={() => {this.saveListChanges()}}>Save Changes</Button>
                                <Alert color="info"
                                       isOpen={this.state.showSuccessAlert}
                                       toggle={() => {this.setState({showSuccessAlert: false})}}
                                       color="success">
                                    Changes successfully saved!
                                </Alert>
                            </div>

                        </Row>
                    </Container>
                </Col>
                <Col md={6}>

                </Col>
            </Row>
        )
    }
}

export default EditEmailListsCard;
