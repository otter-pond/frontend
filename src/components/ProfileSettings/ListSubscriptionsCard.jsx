import React, { Component } from "react";
import LoadingOverlay from 'react-loading-overlay';

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col, Button
} from "reactstrap"
import EmailListAPI from "../../api/EmailListAPI";
import Cookies from "universal-cookie";
import Notify from "react-notification-alert";

class ListSubscriptionsCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            joinableLists: [],
            subscriptions: [],
            loading: false
        }

        this.emailClient = new EmailListAPI();
    }

    componentDidMount() {
        this.loadSubscriptions()
    }

    loadSubscriptions() {
        this.setState({
            loading: true
        }, () => {
            let cookies = new Cookies();
            let user_email = cookies.get("user_email")
            let promises = [this.emailClient.getAllLists(true), this.emailClient.getUserSubscriptions(user_email)]
            Promise.all(promises).then(results => {
                let joinableLists = results[0];
                let subscriptions = results[1];
                joinableLists = joinableLists.filter(list => {
                    let subscription = subscriptions.filter(other_list => {
                        return other_list["address"] === list["address"]
                    })
                    return subscription.length === 0;
                })
                this.setState({
                    joinableLists: joinableLists,
                    subscriptions: subscriptions,
                    loading: false
                })
            })
        })

    }

    subscribe(address) {
        let cookies = new Cookies()
        let userEmail = cookies.get("user_email")
        this.emailClient.addUserToList(address, userEmail).then((result) => {
            if (result["error"] === "Success") {
                var options = {
                    place: "tc",
                    message: `Successfully subscribed to ${address}`,
                    type: "success",
                    autoDismiss: -1,
                    closeButton: true
                };
                this.refs.notify.notificationAlert(options);
                this.loadSubscriptions()
            }
        })
    }

    unsubscribe(address) {
        let cookies = new Cookies()
        let userEmail = cookies.get("user_email")
        this.emailClient.removeUserFromList(address, userEmail).then((result) => {
            if (result["error"] === "Success") {
                var options = {
                    place: "tc",
                    message: `Successfully unsubscribed from ${address}`,
                    type: "success",
                    autoDismiss: -1,
                    closeButton: true
                };
                this.refs.notify.notificationAlert(options);
                this.loadSubscriptions()
            }
        })
    }

    renderList(list, add) {
        return <div>
            <div style={{marginLeft: "30px"}} className={"float-left"}>
                <p style={{fontWeight: "bold"}}>{list["address"]}</p>
                <p style={{marginLeft: "10px"}}>{list["description"]}</p>
            </div>
            <div className={"float-right"}>
                { add ?
                    <Button color={"success"}
                            size={"sm"}
                            onClick={() => {this.subscribe(list["address"])}}>Subscribe</Button>
                :
                    <Button color={"danger"}
                            size={"sm"}
                            onClick={() => {this.unsubscribe(list["address"])}}>Unsubscribe</Button>
                }

            </div>
        </div>
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h2" className="float-left">Email List Subscriptions</CardTitle>
                </CardHeader>
                <CardBody>
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    >
                        <Notify ref="notify"/>
                        <h3>Current Subscriptions</h3>
                        {this.state.subscriptions.map((list,  index) => {
                            return <Row key={index}>
                                <Col md={12}>
                                    {this.renderList(list, false)}
                                </Col>
                            </Row>
                        })}
                        <h3>Available Lists</h3>
                        {this.state.joinableLists.map((list,  index) => {
                            return <Row key={index}>
                                <Col md={12}>
                                    {this.renderList(list, true)}
                                </Col>
                            </Row>
                        })}
                    </LoadingOverlay>
                </CardBody>
            </Card>

        );
    }
}

export default ListSubscriptionsCard;
