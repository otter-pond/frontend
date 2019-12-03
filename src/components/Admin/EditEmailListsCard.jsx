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
import EmailListAPI from "../../api/EmailListAPI";
import RolesAPI from "../../api/RolesAPI";

class EditEmailListsCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailLists: [],
            selectedListCopy: {},
            selectedList: "None",
            showSuccessAlert: false,
            editingSubscribers: false,
            roles: [],
            permissions: []
        }

        this.emailClient = new EmailListAPI();
        this.rolesClient = new RolesAPI();

        this.rolesClient.getRoles().then(roles => {
            this.setState({
                roles: roles
            },() => {
                this.refreshLists()
            })
        })

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
        let editing = this.state.editingSubscribers
        this.setState({
            loading:  true,
            permissions: []
        }, () => {
            this.emailClient.getAllRolePermissions(list.address).then(permissions => {
                this.setState({
                    selectedListCopy: Object.create(list),
                    selectedList: list.address,
                    showSuccessAlert: false,
                    editingSubscribers: false,
                    permissions: permissions,
                    loading: false
                })
                this.props.listSelected(list.address);
                if (editing) {
                    if (!!this.props.showSubscribers) {
                        this.props.showSubscribers(false)
                    }
                }
            })
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

    toggleSubscribers() {
        this.setState({
            editingSubscribers: !this.state.editingSubscribers
        }, () => {
            if (!!this.props.showSubscribers) {
                this.props.showSubscribers(this.state.editingSubscribers)
            }
        })
    }

    getPermission(roleId) {
        let permissions = this.state.permissions.filter(a => {return a["role_id"] === roleId})
        if (permissions.length === 0) {
            return {
                "can_self_join": false,
                "default": false,
                "can_be_invited": false,
                "joined_on_creation": false,
                "role_id": roleId
            }
        }
        return permissions[0]
    }

    updatePermission(e, roleId, toUpdate) {
        e.preventDefault()
        let value = e.target.checked;
        let permission = this.getPermission(roleId);
        permission[toUpdate] = value;
        this.emailClient.setRolePermission(permission, roleId, this.state.selectedListCopy["address"]).then(result => {
            if (result) {
                let permissions = this.state.permissions.filter(a => {return a["role_id"] !== roleId})
                permissions.push(permission)
                this.setState({
                    permissions: permissions
                })
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
            <>
            <Row>
                <Col md={6} style={{borderRight: "1px solid gray"}}>
                    <Container>
                        <h3>List Details</h3>
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
                            <div style={{width: "100%", textAlign: "center", marginTop: "auto"}}>
                                <Button size="sm" onClick={() => {this.saveListChanges()}}>Save List Details</Button>
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
                    <h3>List Permissions</h3>
                    <Table style={{textAlign: "center"}}>
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Can Self Join</th>
                                <th>Can Be Added</th>
                                <th>Added By Default</th>
                                <th>Added On Creation</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.roles.map((role, index) => {
                            let permission = this.getPermission(role["role_id"])
                            return <tr key={index}>
                                <td>{role["role_description"]}</td>
                                <td style={{textAlign: "center"}}>
                                    <Input type={"checkbox"}
                                           onChange={(e) => {this.updatePermission(e, role["role_id"], "can_self_join")}}
                                           checked={permission["can_self_join"]}/>
                                </td>
                                <td style={{textAlign: "center"}}>
                                    <Input type={"checkbox"}
                                           onChange={(e) => {this.updatePermission(e, role["role_id"], "can_be_invited")}}
                                           checked={permission["can_be_invited"]} />
                                </td>
                                <td style={{textAlign: "center"}}>
                                    <Input type={"checkbox"}
                                           onChange={(e) => {this.updatePermission(e, role["role_id"], "default")}}
                                           checked={permission["default"]} />
                                </td>
                                <td style={{textAlign: "center"}}>
                                    <Input type={"checkbox"}
                                           onChange={(e) => {this.updatePermission(e, role["role_id"], "joined_on_creation")}}
                                           checked={permission["joined_on_creation"]} />
                                </td>
                            </tr>
                        })}
                        </tbody>
                    </Table>
                    {
                        /*this.state.roles.map((role, index) => {
                            return <>
                                    <Row>
                                        <h4>{role["role_description"]}</h4>
                                    </Row>
                                    <Row>
                                        <Col sm={3}>
                                            <Label>Can Self Join</Label>
                                        </Col>
                                        <Col sm={3}>
                                            <Label>Can Be Added</Label>
                                        </Col>
                                        <Col sm={3}>
                                            <Label>Added By Default</Label>
                                        </Col>
                                        <Col sm={3}>
                                            <Label>Added On Creation</Label>
                                        </Col>
                                    </Row>
                                </>


                        })
                        */
                    }
                </Col>

            </Row>
            <Row>
                <Col md={12}>
                    <div className="text-center">
                        <Button onClick={() => {this.toggleSubscribers()}}>{this.state.editingSubscribers ? "Hide List Subscribers": "Show List Subscribers"}</Button>
                    </div>
                </Col>
            </Row>
            </>
        )
    }
}

export default EditEmailListsCard;
