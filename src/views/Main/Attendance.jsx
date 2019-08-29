import React from "react";
import {Col, Row} from "reactstrap";
import SelectReportCard from "../../components/Reporting/SelectReportCard";
import ReportEntiresCard from "../../components/Reporting/ReportEntriesCard";


class Attendance extends React.Component {
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
                    <h1>Chapter Attendance</h1>
                    <Row>
                        <Col xs={12}>
                            <SelectReportCard onSelect={(reportId) => {this.setState({selectedReportId: reportId})}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <ReportEntiresCard reportId={this.state.selectedReportId}/>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default Attendance;
