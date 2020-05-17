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
    Col, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Input, Label, Table
} from "reactstrap"
import { Multiselect } from 'multiselect-react-dropdown';
import PositionsAPI from "../../api/PositionsAPI";
import UsersAPI from "../../api/UsersAPI";

class EditPositionsCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            positions: [],
            usersOnPosition: [],
            usersOnPermissionBackup: [],
            permissions: [],
            selectedPositionName: "None",
            editingPosition: {},
            showSuccessAlert: false,
            editingNewPosition: false
        }

        this.positionsApi = new PositionsAPI();
        this.usersApi = new UsersAPI();

        let promises = [this.positionsApi.getAllPositions(), this.positionsApi.getAllPermissions(), this.usersApi.getUsers()]
        Promise.all(promises).then(results => {
            this.setState({
                positions: results[0],
                permissions: results[1],
                users: results[2].map(a => {return {...a, fullName: a["last_name"] + ", " + a["first_name"]}})
            })
        })
    }

    updatePositionField(field, newValue){
        if (newValue === "") {
            newValue = null;
        }
        let position = this.state.editingPosition;
        position[field] = newValue;
        this.setState({
            editingPosition: position
        })
    }

    onPositionSelect(e, index) {
        let position = this.state.positions[index];
        this.positionsApi.getUsersForPosition(position["id"]).then(users => {
            let fullUsers = users.map(a => {
                return this.state.users.filter(u => u["user_email"] === a)[0];;
            });
            this.setState({
                editingPosition: position,
                selectedPositionName: position["name"],
                usersOnPosition: fullUsers,
                usersOnPositionBackup: fullUsers
            });
        });
    }

    onPermissionUpdate(e) {
        let position = this.state.editingPosition
        position["permissions"] = e.map(a => a["name"])
        this.setState({
            editingPosition: position
        })
    }

    onUserUpdate(e) {
        this.setState({
            usersOnPosition:  e
        })
    }

    delete() {
        if (window.confirm("Are you sure? This cannot be undone")) {
            this.positionsApi.delete_position(this.state.editingPosition["id"]).then(() => {
                this.positionsApi.getAllPositions().then(positions => {
                    this.setState({
                        positions: positions,
                        selectedPositionName: "None",
                        showSuccessAlert: true
                    })
                })

            })
        }
    }

    save() {
        if (this.state.editingNewPosition) {
            this.positionsApi.createPosition(this.state.editingPosition).then(result => {
                let id = result["position_id"]
                let position = this.state.editingPosition;
                position["id"] = id
                let promises = []
                promises.push(this.positionsApi.getAllPositions())
                this.state.usersOnPosition.forEach(holder => {
                    promises.push(this.positionsApi.add_holder(id, holder["user_email"]))
                })
                Promise.all(promises).then(result => {
                    this.setState({
                        positions: result[0],
                        showSuccessAlert: true,
                        selectedPositionName: position["Name"],
                        editingPosition: position,
                        usersOnPositionBackup: this.state.usersOnPosition,
                        editingNewPosition: false
                    })
                })
            })
        } else {
            let promises = [this.positionsApi.update_position(this.state.editingPosition["id"], this.state.editingPosition)]

            let holdersToRemove = this.state.usersOnPositionBackup.filter(x => {return this.state.usersOnPosition.filter(a => {return a["user_email"] === x["user_email"]}).length === 0})
            let holdersToAdd = this.state.usersOnPosition.filter(x => {return this.state.usersOnPositionBackup.filter(a => {return a["user_email"] === x["user_email"]}).length === 0})

            holdersToRemove.forEach(holder => {
                promises.push(this.positionsApi.remove_holder(this.state.editingPosition["id"], holder["user_email"]))
            });

            holdersToAdd.forEach(holder => {
                promises.push(this.positionsApi.add_holder(this.state.editingPosition["id"], holder["user_email"]))
            });
            Promise.all(promises).then(results => {
                this.setState({
                    showSuccessAlert: true
                })
            })
        }

    }

    createNew(){
        this.setState({
            editingNewPosition: true,
            selectedPositionName: "New",
            editingPosition: {
                "name": "",
                "description": null,
                "email_address": null,
                "permissions": []
            }
        });
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <div className="clearfix">
                        <CardTitle tag="h2" className="float-left">Edit Positions</CardTitle>
                        <div className="float-right">
                            <div className={"clearfix"}>
                                <div className={"float-left"}>
                                    <Button onClick={() => {this.createNew()}}>Create New</Button>
                                </div>
                                <div className={"float-right"}>
                                    <UncontrolledDropdown>
                                        <DropdownToggle>
                                            Selected: {this.state.selectedPositionName}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {this.state.positions.map((position, index) => {
                                                return <DropdownItem value={position["id"]}
                                                                     key={index}
                                                                     onClick={(e) => {this.onPositionSelect(e, index)}}>{position["name"]}</DropdownItem>
                                            })}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>


                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {this.state.selectedPositionName !== "None" ?
                        this.renderEmailListView(this.state.editingPosition) :
                        <h5>Select an email list to edit.</h5>
                    }
                </CardBody>
            </Card>

        );
    }

    renderEmailListView(editingPosition) {
        return (
            <>
                <h3>Position Details</h3>
            <Row>
                <Col md={6} style={{borderRight: "1px solid gray"}}>
                    <Container>
                        <Row>
                            <Col xs={6}>
                                <p>Name:</p>
                            </Col>
                            <Col xs={6}>
                                <p><Input type="text" value={editingPosition["name"]}
                                          onChange={(e) => {this.updatePositionField("name", e.target.value)}}/></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <p>Description:</p>
                            </Col>
                            <Col xs={6}>
                                <p><Input type="text" value={editingPosition["description"]}
                                          onChange={(e) => {this.updatePositionField("description", e.target.value)}}/></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <p>Email Address (blank if none):</p>
                            </Col>
                            <Col xs={6}>
                                <p><Input type="text" value={editingPosition["email_address"]}
                                          onChange={(e) => {this.updatePositionField("email_address", e.target.value)}}/></p>
                            </Col>
                        </Row>
                        <Row>


                        </Row>
                    </Container>
                </Col>
                <Col md={6}>
                    <Container>
                        <Row>
                            <Col xs={4}>
                                <p>Permissions:</p>
                            </Col>
                            <Col xs={8}>
                                <Multiselect
                                    options={this.state.permissions}
                                    displayValue={"name"}
                                    selectedValues={this.state.editingPosition.permissions.map(a => {return {name: a}})}
                                    onSelect={(e) => this.onPermissionUpdate(e)}
                                    onRemove={(e) => this.onPermissionUpdate(e)}
                                    />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <p>Position Holders:</p>
                            </Col>
                            <Col xs={8}>
                                <Multiselect
                                    options={this.state.users}
                                    displayValue={"fullName"}
                                    selectedValues={this.state.usersOnPosition}
                                    onSelect={(e) => this.onUserUpdate(e)}
                                    onRemove={(e) => this.onUserUpdate(e)}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <div style={{width: "100%", textAlign: "center", marginTop: "auto"}}>
                        <Button size="sm" onClick={() => {this.save()}}>Save Position</Button>
                        <Button size="sm" onClick={() => {this.delete()}} color={"danger"}>Delete Position</Button>
                        <Alert color="info"
                               isOpen={this.state.showSuccessAlert}
                               toggle={() => {this.setState({showSuccessAlert: false})}}
                               color="success"
                               fade={true}>
                            Changes successfully saved!
                        </Alert>
                    </div>
                </Col>
            </Row>
            </>
        )
    }
}

export default EditPositionsCard;
