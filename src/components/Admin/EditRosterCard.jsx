import React, { Component } from "react";

import { Table } from "reactstrap"
import UsersAPI from "../../api/UsersAPI";
import RolesAPI from "../../api/RolesAPI";

class EditRoster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            roles: []
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
        );
    }
}

export default EditRoster;
