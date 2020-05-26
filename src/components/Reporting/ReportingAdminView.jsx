import React, { Component } from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Table
} from "reactstrap"
import Select from 'react-select';
import ReportingAPI from "../../api/ReportingAPI";
import LoadingOverlay from "react-loading-overlay";
import RolesAPI from "../../api/RolesAPI";

class ReportingAdminView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminReports: [],
            semesters: [],
            types: [],
            roles: [],
            loading: true,
        }

        this.reportingApi = new ReportingAPI();
        this.rolesApi = new RolesAPI();

        let promises = [this.reportingApi.getAdminReports(), this.reportingApi.getSemesters(),
            this.reportingApi.getReportTypes(),this.rolesApi.getRoles()]

        Promise.all(promises).then(results => {
            this.setState({
                adminReports: results[0],
                semesters: results[1],
                types: results[2],
                roles: results[3],
                loading: false
            })
        })
    }



    render() {
        return (
            <>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h2" className="float-left">Reports I Can Manage</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <LoadingOverlay
                                    active={this.state.loading}
                                    spinner
                                    text='Loading...'
                                >
                                {this.state.loading ?
                                    <div style={{height: "100px"}} />
                                : this.state.adminReports.length === 0 ?
                                            <h4>You do not have permissions to manage any reports</h4>
                                :
                                    this.renderReportsToManage()
                                }

                                </LoadingOverlay>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} sm={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h2" className="float-left">Report Types</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <LoadingOverlay
                                    active={this.state.loading}
                                    spinner
                                    text='Loading...'
                                >
                                    {this.renderReportTypes()}
                                </LoadingOverlay>

                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={6} sm={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h2" className="float-left">Semesters</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <LoadingOverlay
                                    active={this.state.loading}
                                    spinner
                                    text='Loading...'
                                >
                                    {this.renderSemesters()}
                                </LoadingOverlay>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }

    renderReportsToManage() {
        return (
            <>
                <p>The following are reports that you have permissions to manage: </p>
                <div style={{maxHeight: "300px", overflowY: "scroll"}}>
                    <Table striped={true}>
                        <thead>
                            <tr>
                                <th>Report Name</th>
                                <th>Semester</th>
                                <th>Report Type</th>
                                <th>Applicable Roles</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.adminReports.map((report, index) => {
                            let type = this.state.types.filter(a => {return a["report_type_id"] === report["report_type_id"]})[0]
                            let semester = this.state.semesters.filter(a => {return a["semester_id"] === report["semester_id"]})[0]
                            let roles = this.state.roles.filter(a => {return report["applicable_roles"].includes(a["role_id"])})
                                .map(item => {return item["role_description"]}).join(", ")
                            console.log(roles)
                            return (
                                <tr key={index}>
                                    <td>{report["name"]}</td>
                                    <td>{semester["description"]}</td>
                                    <td>{type["name"]}</td>
                                    <td>{roles}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </div>
            </>
        )
    }


    renderReportTypes() {
        return (
            <div style={{maxHeight: "300px", overflowY: "scroll"}}>
                <Table striped={true}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Value Type</th>
                            <th>Required Permissions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.types.map((type, index) => {
                        return (
                            <tr>
                                <td>{type["name"]}</td>
                                <td>{type["value_type"].charAt(0).toUpperCase() +
                                    type["value_type"].slice(1)}</td>
                                <td>{type["management_permissions"].join(", ")}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        )
    }

    renderSemesters() {
        return (
            <div style={{maxHeight: "300px", overflowY: "scroll"}}>
                <Table striped={true}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.semesters.map((semester, index) => {
                        return (
                            <tr>
                                <td>{semester["description"]}</td>
                                <td>{semester["start_date"]}</td>
                                <td>{semester["end_date"]}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default ReportingAdminView;
