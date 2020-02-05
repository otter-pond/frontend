import React, { Component } from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    CardSubtitle,
    Table,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    Input
} from "reactstrap"
import UsersAPI from "../../api/UsersAPI";
import RolesAPI from "../../api/RolesAPI";
import LoadingOverlay from "react-loading-overlay";

class EditRosterCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            roles: [],
            selectedRole: "None",
            selectedRoleId: "",
            activeUsers: [],
            loading: false
        }

        this.usersClient = new UsersAPI();
        this.rolesClient = new RolesAPI();

        this.usersClient.getUsers().then(users => {
            var userMap = {};
            users.forEach(user => {
                userMap[user["user_email"]] = user;
            });
            this.setState({
                users: userMap
            });
        }).catch(e => {
            console.log("Unable to load users.")
        });

        this.rolesClient.getRoles().then(roles => {
            this.setState({
                roles: roles
            });
        }).catch(e => {
            console.log("Unable to load roles.")
        })
    }

    setActiveRole(role_id) {
        this.setState({
            loading: true
        }, () => {
            let role = this.state.roles.filter(a => {return a.role_id === role_id})[0];
            this.rolesClient.getUsersWithRole(role_id).then(users => {
                users.sort((a,b) => (a["last_name"] > b["last_name"]) ? 1 : ((b["last_name"] > a["last_name"]) ? -1 : 0));
                this.setState({
                    selectedRole: role_id !== "none" ? role["role_description"] : "Users Without Role",
                    selectedRoleId: role_id,
                    activeUsers: users,
                    loading: false
                })
            }).catch((e) => {
                console.log("unable to load users with role: " + e);
                this.setState({
                    loading: false
                })
            })
        })
    }

    dropdownSelect(event) {
        this.setState({
            selectedRole: "Loading"
        })
        this.setActiveRole(event.target.value)
    }

    renderRoleDropdown(selected, onClick) {
        return (
            <UncontrolledDropdown>
                <DropdownToggle>
                    Selected: {selected}
                </DropdownToggle>
                <DropdownMenu>
                    {this.state.roles.map((role, index) => {
                        return <DropdownItem value={role["role_id"]} onClick={(e) => onClick(e)} key={index}>{role["role_description"]}</DropdownItem>
                    })}
                    <DropdownItem value={"none"} onClick={(e) => onClick(e)}>Users Without Role</DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        )
    }

    updateRole(newRoleId, userEmail) {
        console.log(newRoleId + userEmail);
        this.rolesClient.setUserRole(newRoleId, userEmail).then(() => {
            let users = this.state.activeUsers.filter(a => {return a !== userEmail});
            this.setState({
                activeUsers: users
            });
        }).catch(() => {
            console.error("Error setting user role");
        })
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <div className="clearfix">
                        <CardTitle tag="h2" className="float-left">Edit Roster</CardTitle>
                        <div className="float-right">
                            <div className="float-right">
                            {this.renderRoleDropdown(this.state.selectedRole, (e) => {this.dropdownSelect(e)})}
                            </div>
                            {/*<Button className="float-right">Change User Roles</Button>*/}
                        </div>
                    </div>
                    <div className="float-left" hidden={this.state.selectedRole === "None"}>
                        <CardSubtitle className="float-left">Roster Count: {this.state.activeUsers.length}</CardSubtitle>
                    </div>
                </CardHeader>
                <CardBody>
                    {this.state.selectedRole === "None" ?
                        <h5>Select a role to edit.</h5>
                    :
                        <div>
                            <LoadingOverlay
                                active={this.state.loading}
                                spinner
                                text='Loading...'
                            >
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Last Name</th>
                                        <th>First Name</th>
                                        <th>Role</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.activeUsers.map((user_email, index) => {
                                        let user = this.state.users[user_email];
                                        if (!user)
                                            return
                                        return (
                                            <tr key={index}>
                                                <td>{user.last_name}</td>
                                                <td>{user.first_name}</td>
                                                <td>
                                                    <Input type="select" style={{width: 200}} value={this.state.selectedRoleId}
                                                           onChange={(e) => {this.updateRole(e.target.value, user_email)}}>
                                                        {this.state.roles.map((role, index) => {
                                                            return <option value={role.role_id} key={index}>{role.role_description}</option>
                                                        })}
                                                        <option value={"none"}>No Role</option>
                                                    </Input>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </Table>
                            </LoadingOverlay>
                        </div>
                    }

                </CardBody>
            </Card>

        );
    }
}

export default EditRosterCard;
