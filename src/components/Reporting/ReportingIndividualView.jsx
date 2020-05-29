import React from "react";
import {Col, Row, Button} from "reactstrap";
import SelectReportCard from "../../components/Reporting/SelectReportCard";
import ReportEntiresCard from "../../components/Reporting/ReportEntriesCard";
import ReportTableCard from "../../components/Reporting/ReportTableCard";
import {  Link } from "react-router-dom";


class ReportingIndividualView extends React.Component {
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
        );
    }
}

export default ReportingIndividualView;
