import React from "react";

import EditRosterCard from "../../components/Admin/EditRosterCard";
import EditEmailListsCard from "../../components/Admin/EditEmailListsCard";
import ShowEmailList from "../../components/Admin/ShowEmailList";

// reactstrap components
import {
    Row,
    Col,
} from "reactstrap";
import EmailListAPI from "../../api/EmailListAPI";
import UsersAPI from "../../api/UsersAPI";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailList: "",
            showSubscribers: false
        }

    }

    listSelected(selectedList) {
        console.log(selectedList);
        this.setState({
            emailList: selectedList
        })
    }

    showSubscribers(show) {
        this.setState({
            showSubscribers: show
        })
    }

    render() {
        return (
            <>
                <div className="content">
                    <h1>Admin</h1>
                    <Row>
                        <Col xs={12}>
                            <EditEmailListsCard
                                listSelected={(list) => {this.listSelected(list)}}
                                showSubscribers={(show) => this.showSubscribers(show)}
                            />
                        </Col>
                    </Row>
                    {this.state.showSubscribers &&
                        <Row>
                            <Col xs={12}>
                                <ShowEmailList emailList={ this.state.emailList }/>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col xs={12}>
                            <EditRosterCard />
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default Admin;
