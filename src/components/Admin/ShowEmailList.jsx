import React, { Component } from "react";
import {
    Card, CardBody,
    CardHeader,
    CardTitle, Input, Table,
    Button
} from "reactstrap";
import EmailListAPI from "../../api/EmailListAPI";
import UsersAPI from "../../api/UsersAPI";
import LoadingOverlay from "react-loading-overlay";

class ShowEmailList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            users: [],
            emailList: null,
            viewingSubscribers: true,
            loading: true
        }

        this.emailClient = new EmailListAPI();
        this.userClient = new UsersAPI();

        this.loadUsersToShow(props.emailList);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.emailList !== this.state.emailList) {
            this.setState({
                loading: true
            }, () => {
                this.loadUsersToShow(nextProps.emailList)
            })
        }
    }

    loadAllUsers() {
        return new Promise((resolve, reject) => {
            if (this.state.allUsers.length > 0) {
                resolve()
            } else {
                this.userClient.getUsers().then(users =>[
                    this.setState({
                        allUsers: users
                    }, () => {
                        resolve()
                    })
                ])
            }
        })
    }

    loadUsersToShow(address) {
        this.loadAllUsers().then(() => {
            this.emailClient.getAllUsersFromList(address).then((emails) => {
                let users = this.state.allUsers
                if (this.state.viewingSubscribers) {
                    users = users.filter(a => {return emails.includes(a["user_email"])})
                } else {
                    users = users.filter(a => {return !emails.includes(a["user_email"])})
                }

                const usersEmails = [];
                for (let index in users) {
                    let user = users[index]
                    let user_details = {
                        "email": user["user_email"],
                        "user": user,
                    }
                    usersEmails.push(user_details);
                }

                usersEmails.sort((userA, userB) => {
                    try {
                        return userA["user"]['last_name'].localeCompare(userB["user"]['last_name'])
                    } catch (e) {
                        return 0
                    }
                });
                this.setState({
                    users: usersEmails,
                    emailList: address,
                    loading: false
                })
            })
        })
    }

    removeFromList(userEmail) {
        this.emailClient.removeUserFromList(this.state.emailList, userEmail).then(result => {
            if (result["error"] === "Success") {
                let userEmails = this.state.users;
                userEmails = userEmails.filter(a => {return a["email"] !== userEmail})
                this.setState({users: userEmails})
            }
        })
    }

    addToList(userEmail){
        this.emailClient.addUserToList(this.state.emailList, userEmail).then(result => {
            if (result["error"] === "Success") {
                let userEmails = this.state.users;
                userEmails = userEmails.filter(a => {return a["email"] !== userEmail})
                this.setState({users: userEmails})
            }
        })
    }

    toggleView() {
        this.setState({
            viewingSubscribers: !this.state.viewingSubscribers
        }, () => {
            this.loadUsersToShow(this.state.emailList)
        })
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <div className="clearfix">
                        <CardTitle tag="h2" className="float-left">{this.state.viewingSubscribers ? "Subscribers" : "Non-Subscribers"} of {this.props.emailList} <Button onClick={() => {this.toggleView()}} size="sm">Toggle View</Button></CardTitle>
                    </div>
                </CardHeader>
                <CardBody>
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    >
                        <div>
                            <Table>
                                <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.users.map((entry, index) => {
                                    return(
                                        <tr key={index}>
                                            <td>{entry['user']['last_name']}, {entry['user']['first_name']}</td>
                                            <td>{entry['email']}</td>
                                            <td>{this.state.viewingSubscribers ? <Button onClick={() => {this.removeFromList(entry["email"])}} size="sm">Remove</Button>:
                                                <Button onClick={() => {this.addToList(entry["email"])}} size="sm">Add</Button>}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        </div>
                    </LoadingOverlay>
                </CardBody>
            </Card>
        );
    }

}

export default ShowEmailList;