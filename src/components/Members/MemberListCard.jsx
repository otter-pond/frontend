import React, { Component } from "react";
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle, Table,
} from "reactstrap"

import LoadingOverlay from "react-loading-overlay";
import UsersAPI from "../../api/UsersAPI";
import RolesAPI from "../../api/RolesAPI";
import MemberDetailsModal from "./MemberDetailsModal.jsx";


class MemberListCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            users: [],
            roles: [],
            selectedUser: null
        };

        this.usersClient = new UsersAPI();
        this.rolesClient = new RolesAPI();

    }

    componentDidMount() {
        this.loadUsers()
    }

    loadUsers() {
        this.setState({
            loading: true
        }, () => {
            let promises = [this.usersClient.getUsers(), this.rolesClient.getRoles()];
            Promise.all(promises).then((results) => {
                let users = results[0]
                let roles = results[1]

                users.sort((a, b) => {
                    return a["last_name"].localeCompare(b["last_name"])
                })

                this.setState({
                    users: users,
                    roles: roles,
                    loading: false
                })
            })
        })
    }

    selectUser(user) {
        this.setState({
            selectedUser: user,
        })
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h2" className="float-left">Member List</CardTitle>
                </CardHeader>
                <CardBody>
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    >
                        <p>Click on a member to view details and contact information</p>
                        <MemberDetailsModal isOpen={this.state.selectedUser !== null} user={this.state.selectedUser} close={() => {this.setState({selectedUser: null})}}/>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Last Name</th>
                                    <th>First Name</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.users.map((user, index) => {
                                let role = {"role_description": "Unavailable"};
                                try {
                                    role = this.state.roles.filter((a) => {return a["role_id"] === user["role_id"]})[0]
                                } catch{
                                    console.log("Error loading role: " + user["user_email"])
                                }
                                return <tr key={index} onClick={(e) => {e.preventDefault(); this.selectUser(user)}}>
                                    <td>{user["last_name"]}</td>
                                    <td>{user["first_name"]}</td>
                                    <td>{role["role_description"]}</td>
                                </tr>
                            })}
                            </tbody>
                        </Table>
                    </LoadingOverlay>
                </CardBody>
            </Card>

        );
    }
}

export default MemberListCard;
