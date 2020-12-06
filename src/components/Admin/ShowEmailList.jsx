import React, { Component } from "react";
import {
    Card, CardBody,
    CardHeader,
    CardTitle, CardSubtitle, Input, Table,
    Button
} from "reactstrap";
import EmailListAPI from "../../api/EmailListAPI";
import UsersAPI from "../../api/UsersAPI";
import LoadingOverlay from "react-loading-overlay";
import Notify from 'react-notification-alert';

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
                ]).catch(e => {
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
            } else {
                let message = `Cannot add ${userEmail} to ${this.state.emailList}. The user's role is missing the following 
                permission: ${result["permission"] === "can_self_join" ? "Can Self Join": "Can Be Added"}`;
                var options = {
                    place: "tc",
                    message: message,
                    type: "danger",
                    autoDismiss: -1,
                    closeButton: true
                };
                this.refs.notify.notificationAlert(options);
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
                        <CardTitle tag="h2" className="float-left">{this.state.viewingSubscribers ? "Subscribers" : "Non-Subscribers"} of {this.props.emailList} </CardTitle>
                        <div className="float-right">
                            <div className="float-right">
                                <Button className="float-right" onClick={() => {this.toggleView()}} size="sm">{this.state.viewingSubscribers ? "View Non-Subscribers" : "View Subscribers"}</Button>
                            </div>
                        </div>
                    </div>
                    <CardSubtitle className="float-left">{this.state.viewingSubscribers ? "Subscriber Count: " : "Non-Subscriber Count: "} {this.state.users.length}</CardSubtitle>
                </CardHeader>
                <CardBody>
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    >
                        <div>
                            <Notify ref="notify"/>
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