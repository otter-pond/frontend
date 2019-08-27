import React, { Component } from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Container,
    Row,
    Button,
    Alert,
    Col, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Input
} from "reactstrap"
import ReportingAPI from "../../api/ReportingAPI";

class SelectReportCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            selectedReportId: ""
        }

        this.reportingApi = new ReportingAPI();

        this.reportingApi.getReports().then((reports) => {
            this.setState({
                reports: reports
            })
        }).catch(e => {
            console.log("Unable to load reports: " + e)
        })
    }

    getReportTitle() {
        return this.state.reports.filter(a => { return a.report_id === this.state.selectedReportId })[0]["name"]
    }

    onReportSelect(e) {
        let reportId = e.target.value;
        this.setState({
            selectedReportId: reportId
        }, () => {
            if (this.props.onSelect) {
                this.props.onSelect(reportId)
            }
        })
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h2" className="float-left">Select Report to View</CardTitle>
                </CardHeader>
                <CardBody>
                    <UncontrolledDropdown>
                        <DropdownToggle>
                            Selected: {this.state.selectedReportId === "" ? "None" : this.getReportTitle()}
                        </DropdownToggle>
                        <DropdownMenu>
                            {this.state.reports.map((report, index) => {
                                return <DropdownItem value={report["report_id"]}
                                                     key={report["report_id"]}
                                                     onClick={(e) => {this.onReportSelect(e)}}>{report["name"]}</DropdownItem>
                            })}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </CardBody>
            </Card>

        );
    }
}

export default SelectReportCard;
