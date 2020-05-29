import React from "react";
import {Col, Row, Button} from "reactstrap";
import SelectReportCard from "../../components/Reporting/SelectReportCard";
import ReportEntiresCard from "../../components/Reporting/ReportEntriesCard";
import ReportTableCard from "../../components/Reporting/ReportTableCard";
import ReportingAdminOverviewView from "../../components/Reporting/ReportingAdminOverviewView";
import { Route, Switch, Redirect, Link } from "react-router-dom";
import ReportingIndividualView from "../../components/Reporting/ReportingIndividualView";


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
                            <ReportingAdminOverviewView />
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
                            <ReportingIndividualView />
                        </Route>
                    </Switch>
                </div>
            </>
        );
    }
}

export default Reporting;
