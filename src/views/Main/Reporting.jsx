import React from "react";
import {Col, Row} from "reactstrap";
import SelectReportCard from "../../components/Reporting/SelectReportCard";
import ReportEntiresCard from "../../components/Reporting/ReportEntriesCard";


class Reporting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedReportId: ""
        }
    }

    render() {
        return (
            <>
                <div className="content">
                    <h1>Reporting</h1>
                    <Row>
                        <Col xs={12}>
                            <SelectReportCard onSelect={(reportId) => {this.setState({selectedReportId: reportId})}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <ReportEntiresCard reportId={this.state.selectedReportId} sortDirection={"asc"}/>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default Reporting;
