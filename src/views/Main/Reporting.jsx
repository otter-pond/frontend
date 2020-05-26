import React from "react";
import {Col, Row, Button} from "reactstrap";
import SelectReportCard from "../../components/Reporting/SelectReportCard";
import ReportEntiresCard from "../../components/Reporting/ReportEntriesCard";
import ReportTableCard from "../../components/Reporting/ReportTableCard";
import ReportingAdminView from "../../components/Reporting/ReportingAdminView";
import { Route, Switch, Redirect, Link } from "react-router-dom";


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
                            <ReportingAdminView />
                        </Route>
                        <Route>
                            <>

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
                                <Row>
                                    <Col xs={12}>
                                        <SelectReportCard onSelect={(reportId) => {this.setState({selectedReportId: reportId})}}
                                                          adminSelection={(individualAdminView, selectedIndividual) => {this.adminSelection(individualAdminView, selectedIndividual)}}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        {this.state.individualView ?
                                            <ReportEntiresCard reportId={this.state.selectedReportId} sortDirection={"asc"} selectedIndividual={this.state.selectedIndividual}/>
                                            :
                                            <ReportTableCard reportId={this.state.selectedReportId} />
                                        }

                                    </Col>
                                </Row>
                            </>
                        </Route>
                    </Switch>
                </div>
            </>
        );
    }
}

export default Reporting;
