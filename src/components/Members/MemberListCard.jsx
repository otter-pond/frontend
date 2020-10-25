import React, { Component } from "react";
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle, Table,
    Pagination,
    PaginationItem,
    PaginationLink,
    Input
} from "reactstrap"

import LoadingOverlay from "react-loading-overlay";
import UsersAPI from "../../api/UsersAPI";
import RolesAPI from "../../api/RolesAPI";
import MemberDetailsModal from "./MemberDetailsModal.jsx";
import Select from "react-select";


class MemberListCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            users: [],
            roles: [],
            selectedUser: null,
            currentPage: 0,
            searchTerm: ""
        };

        this.pageSize = 1;

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

                for (let roleIndex in roles){
                    roles[roleIndex].selected = true
                }

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

    handlePageClick(e, i) {
        e.preventDefault()
        this.setState({
            currentPage: i
        })
    }

    handlePreviousClick(e) {
        e.preventDefault()
        this.setState({
            currentPage: this.state.currentPage == 0 ? 0 : this.state.currentPage - 1
        })
    }

    handleNextClick(e) {
        e.preventDefault()
        this.setState({
            currentPage: this.state.currentPage == 0 ? 0 : this.state.currentPage + 1
        })
    }

    filterUsers(users, searchTerm, roles) {
        searchTerm = searchTerm.toLowerCase()
        let role_ids = []
        for (let roleIndex in roles) {
            if (roles[roleIndex].selected) {
                role_ids.push(roles[roleIndex]["role_id"])
            }
        }
        return users.filter(user => {
            try {
                if (searchTerm === "") {
                    return role_ids.includes(user["role_id"])
                }
                return (user["first_name"].toLowerCase().includes(searchTerm) || user["last_name"].toLowerCase().includes(searchTerm)) && role_ids.includes(user["role_id"])
            } catch {
                return true
            }
        })
    }

    getRoleOptions(roles) {
        let toReturn = []
        for (let roleIndex in roles) {
            toReturn.push({
                value: roleIndex,
                label: roles[roleIndex]["role_description"]
            })
        }

        return toReturn
    }

    getRoleValues(roles) {
        let toReturn = []
        for (let roleIndex in roles) {
            if (roles[roleIndex].selected === true) {
                toReturn.push({
                    value: roleIndex,
                    label: roles[roleIndex]["role_description"]
                })
            }
        }

        return toReturn
    }

    updateSelected(indices) {
        let roles = this.state.roles

        for (let roleIndex in roles) {
            if (indices !== null && indices.filter(a => {return a.value === roleIndex}).length > 0) {
                roles[roleIndex].selected = true
            } else {
                roles[roleIndex].selected = false
            }
        }

        this.setState({
            roles: roles
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
                        <div>
                            <div className={"d-inline-block"}>
                                <p style={{"fontWeight": "bold"}}>Search: </p>
                            </div>
                            <div className={"d-inline-block"} style={{marginLeft: "20px"}}>
                                <Input type={"text"} style={{width: "300px"}} onChange={(e) => this.setState({searchTerm: e.target.value})}/>
                            </div>
                            <div className={"d-inline-block"} style={{marginLeft: "20px"}}>
                                <Select
                                    name={"roles"}
                                    placeholder={"Roles"}
                                    options={this.getRoleOptions(this.state.roles)}
                                    value={this.getRoleValues(this.state.roles)}
                                    onChange={(selected) => {this.updateSelected(selected)}}
                                    isMulti
                                />
                            </div>
                        </div>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Last Name</th>
                                    <th>First Name</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                            {//this.filterUsers(this.state.users, this.state.searchTerm, this.state.roles).slice(this.state.currentPage * this.pageSize, (this.state.currentPage + 1) * this.pageSize).map((user, index) => {
                            this.filterUsers(this.state.users, this.state.searchTerm, this.state.roles).map((user, index) => {
                                try {
                                    let roles = this.state.roles.filter((a) => {
                                        return a["role_id"] === user["role_id"]
                                    })
                                    let role = {"role_description": "Unavailable"}
                                    if (roles.length > 0) {
                                        role = roles[0]
                                    }
                                    return <tr key={index} onClick={(e) => {
                                        e.preventDefault();
                                        this.selectUser(user)
                                    }} style={{cursor:"pointer"}}>
                                        <td>{user["last_name"]}</td>
                                        <td>{user["first_name"]}</td>
                                        <td>{role["role_description"]}</td>
                                    </tr>
                                } catch {
                                    return <tr>
                                        <td>Error</td>
                                        <td>Error</td>
                                        <td>Error</td>
                                    </tr>
                                }
                            })}
                            </tbody>
                        </Table>
                        {/*<Pagination>*/}
                        {/*    <PaginationItem disabled={this.state.currentPage <= 0}>*/}
                        {/*        <PaginationLink onClick={this.handlePreviousClick.bind(this)} previous href="#" />*/}
                        {/*    </PaginationItem>*/}
                        {/*    {[...Array(Math.ceil(this.state.users.length / this.pageSize))].map((page, i) => (*/}
                        {/*        <PaginationItem active={i === this.state.currentPage} key={i}>*/}
                        {/*            <PaginationLink onClick={e => this.handlePageClick(e, i)} href="#">*/}
                        {/*                {i + 1}*/}
                        {/*            </PaginationLink>*/}
                        {/*        </PaginationItem>*/}
                        {/*    ))}*/}
                        {/*</Pagination>*/}
                    </LoadingOverlay>
                </CardBody>
            </Card>

        );
    }
}

export default MemberListCard;
