import React from "react";
import {Col, Row, Button} from "reactstrap";
import ReportAdminOverview from "../../components/Reporting/Admin/ReportAdminOverview";
import ReportAdminView from "../../components/Reporting/Admin/ReportAdminView";
import { Route, Switch, Redirect, Link } from "react-router-dom";
import ReportIndividualView from "../../components/Reporting/ReportIndividualView";


class Reporting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedReportId: "",
            adminMode: false,
            individualView: true,
            selectedIndividual: "",
        }
    }

    adminSelection(individualAdminView, selectedIndividual = "") {
        this.setState({
            individualView: individualAdminView,
            selectedIndividual: selectedIndividual,
            adminMode: true
        })
    }

    render() {
        return (
            <>
                <div className="content">
                    <Switch>
                        <Route path={"/main/reporting/manage/:report_id"}>
                            <div className={"clearfix"}>
                                <div className={"float-left"}>
                                    <h1>Reporting (Admin View)</h1>
                                </div>
                                <div className={"float-right"}>
                                    <Link to={"/main/reporting"}>
                                        <Button>
                                            Switch to Individual View
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <ReportAdminView />
                        </Route>
                        <Route path={"/main/reporting/manage"}>

                            <div className={"clearfix"}>
                                <div className={"float-left"}>
                                    <h1>Reporting (Admin View)</h1>
                                </div>
                                <div className={"float-right"}>
                                    <Link to={"/main/reporting"}>
                                        <Button>
                                            Switch to Individual View
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <ReportAdminOverview />
                        </Route>
                        <Route>
                            <div className={"clearfix"}>
                                <div className={"float-left"}>
                                    <h1>Reporting (Individual View)</h1>
                                </div>
                                <div className={"float-right"}>
                                    <Link to={"/main/reporting/manage"}>
                                        <Button>
                                            Switch to Admin View
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <ReportIndividualView />
                        </Route>
                    </Switch>
                </div>
            </>
        );
    }
}

export default Reporting;
