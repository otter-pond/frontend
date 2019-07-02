import React, { Component } from "react";

import {Card, CardBody, CardHeader, CardTitle, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle} from "reactstrap"
import UsersAPI from "../../api/UsersAPI";
import RolesAPI from "../../api/RolesAPI";

class EditRosterCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            roles: [],
            selectedRole: ""
        }

        let usersClient = new UsersAPI();
        let rolesClient = new RolesAPI();

        usersClient.getUsers().then(users => {
            this.setState({
                users: users
            })
        }).catch(e => {
            console.log("Unable to load users.")
        });

        rolesClient.getRoles().then(roles => {
            this.setState({
                roles: roles
            })
        }).catch(e => {
            console.log("Unable to load roles.")
        })
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <div className="clearfix">
                        <CardTitle tag="h2">Edit Roster</CardTitle>
                    </div>
                </CardHeader>
                <CardBody>
                    <div>
                        <Table>
                            <thead>
                            <tr>
                                <th>Last Name</th>
                                <th>First Name</th>
                                <th>Role</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.users.map((user, index) => {
                                return (
                                    <tr>
                                        <td>{user.last_name}</td>
                                        <td>{user.first_name}</td>
                                        <td></td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </div>
                </CardBody>
            </Card>

        );
    }
}

export default EditRosterCard;
