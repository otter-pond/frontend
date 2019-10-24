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
import Select from 'react-select';
import ReportingAPI from "../../api/ReportingAPI";

class SelectReportCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            selectedReportId: "",
            admin: false,
            applicableUsers: [],
            individualAdminView: true,
            selectedIndividual: ""
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

    getOptions(applicableUsers) {
        let options = []

        for (let user_index in applicableUsers) {
            let user = applicableUsers[user_index]
            let option = {
                value: user["user_email"],
                label: user["last_name"] + ", " + user["first_name"]
            }
            options.push(option)
        }
        options.sort((a, b) => {
            return a.label - b.label
        })
        return options
    }

    selectIndividual(e) {
        let email = e.value
        this.setState({
            selectedIndividual: email
        })
    }

    onReportSelect(e) {
        let reportId = e.target.value;
        this.reportingApi.checkReportPermissions(reportId).then(canManage => {
            if (canManage && !this.props.enableAdmin) {
                this.reportingApi.getApplicableUsers(reportId).then(users => {
                    this.setState({
                        selectedReportId: reportId,
                        applicableUsers: users,
                        admin: true
                    }, () => {
                        if (this.props.onSelect) {
                            this.props.onSelect(reportId)
                        }
                    })
                })
            }
            else {
                this.setState({
                    selectedReportId: reportId
                }, () => {
                    if (this.props.onSelect) {
                        this.props.onSelect(reportId)
                    }
                })
            }
        });

    }

    toggleView() {
        this.setState({
            individualAdminView: !this.state.individualAdminView
        })
    }

    updateView() {
        if (this.props.adminSelection) {
            this.props.adminSelection(this.state.individualAdminView, this.state.selectedIndividual)
        }
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h2" className="float-left">Select Report</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md={5}>
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
                        </Col>
                        {this.state.admin &&
                            <Col md={7}>
                                <h4>Current Mode: {this.state.individualAdminView ? "Individual" : "Table"} View</h4>
                                {this.state.individualAdminView &&
                                    <div style={{width: 200}}>
                                        <Select
                                            //value={this.state.selectedReportId}
                                            onChange={(e) => {this.selectIndividual(e)}}
                                            options={this.getOptions(this.state.applicableUsers)}
                                        />
                                    </div>
                                }
                                <Button onClick={() => {this.toggleView()}} size="sm">Switch to {this.state.individualAdminView ? "Table" : "Individual"}</Button>
                                <Button onClick={() => {this.updateView()}} size="sm">Update View</Button>
                            </Col>
                        }
                    </Row>
                </CardBody>
            </Card>

        );
    }
}

export default SelectReportCard;
