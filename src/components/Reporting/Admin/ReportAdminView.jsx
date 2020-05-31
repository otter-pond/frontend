import React, { Component } from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Container,
    Table, ModalHeader, ModalBody, ModalFooter, Button, Modal,
    Form, FormGroup, Input, Label, Alert
} from "reactstrap"
import ReportingAPI from "../../../api/ReportingAPI";
import LoadingOverlay from "react-loading-overlay";
import RolesAPI from "../../../api/RolesAPI";
import PositionsAPI from "../../../api/PositionsAPI";
import {Multiselect} from "multiselect-react-dropdown";
import Cookies from "universal-cookie";
import {withRouter} from "react-router-dom";
import UsersAPI from "../../../api/UsersAPI";
import ReportTotals from "./ReportTotals";
import IndividualView from "./IndividualView";

const cookies = new Cookies();

class ReportAdminView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            report_id: this.props.match.params.report_id,
            report: null,
            permissions: [],
            reportType: null,
            semester: null,
            roles: [],
            users: [],
            entries: [],
            loading: true,
            editingReport: null,
            reportSuccess: false,
            viewType: null,
            deleteSuccess: false,
            reportForm: null,
            editingForm: null,
            formSuccess: false
        };


        this.reportingApi = new ReportingAPI();
        this.rolesApi = new RolesAPI();
        this.usersApi = new UsersAPI();

        this.permissions = cookies.get("permissions")

        this.reportingApi.getReportById(this.state.report_id).then(report => {
            let promises = [this.reportingApi.getReportTypeById(report["report_type_id"]),
                            this.reportingApi.getSemesterById(report["semester_id"]),
                            this.rolesApi.getRoles(),
                            this.reportingApi.getReportEntries(this.state.report_id),
                            this.usersApi.getUsers(),
                            this.reportingApi.getReportFormById(this.state.report_id)];

            Promise.all(promises).then(results => {
                this.setState({
                    report: report,
                    reportType: results[0],
                    semester: results[1],
                    roles: results[2],
                    entries: results[3],
                    users: results[4],
                    reportForm: results[5].valueQuestion === null ? null : results[5],
                    loading: false
                })
            })
        });
    }

    saveReport() {
        let report = {
            name: this.state.editingReport["name"],
            description: this.state.editingReport["description"],
            applicable_roles: this.state.editingReport["applicable_roles"],
        };
        this.reportingApi.updateReport(this.state.report_id, report).then(() => {
            this.setState({
                editingReport: null,
                reportSuccess: true,
                loading: true,
                viewType: null
            }, () => {
                this.reportingApi.getReportById(this.state.report_id).then(report => {
                    this.setState({
                        report: report,
                        loading: false
                    })
                })
            })

        })
    }

    getApplicableUsers() {
        return this.state.users.filter(user => {
            return this.state.report["applicable_roles"].includes(user["role_id"])
        })
    }

    onApplicableRolesUpdate(e) {
        let report = this.state.editingReport;
        report["applicable_roles"] = e.map(a => a["role_id"]);
        this.setState({
            editingReport: report
        })
    }

    deleteReportEntry(userEmail, entryId) {
        if (window.confirm("Are you sure? This cannot be undone")) {
            this.setState({
                loading: true
            }, () => {
                this.reportingApi.deleteReportEntry(this.state.report_id, userEmail, entryId).then(() => {
                    this.reportingApi.getReportEntries(this.state.report_id).then(entries => {
                        this.setState({
                            entries: entries,
                            loading: false,
                            deleteSuccess: true
                        })
                    })
                })
            })

        }
    }

    saveForm() {
        let form = this.state.editingForm
        this.setState({
            loading: true
        }, () => {
            this.reportingApi.createReportForm(this.state.report_id, form).then(result => {
                this.reportingApi.getReportFormById(this.state.report_id).then(form => {
                    this.setState({
                        loading: false,
                        editingForm: null,
                        formSuccess: true,
                        reportForm: form
                    })
                })
            })
        })
    }

    deleteForm() {
        this.setState({
            loading: true
        }, () => {
            this.reportingApi.deleteReportForm(this.state.report_id).then(result => {
                this.reportingApi.getReportFormById(this.state.report_id).then(form => {
                    this.setState({
                        loading: false,
                        editingForm: null,
                        formSuccess: true,
                        reportForm: form
                    })
                })
            })
        })
    }

    editForm() {
        if (this.state.reportForm === null) {
            this.setState({
                editingForm: {
                    valueQuestion: "",
                    descriptionQuestions: [
                        {
                            "question": "",
                            "answerType": "text"
                        }
                    ]
                }
            })
        } else {
            this.setState({
                editingForm: this.state.reportForm
            })
        }
    }

    render() {
        return (
            <>
                <LoadingOverlay
                    active={this.state.loading}
                    spinner
                    text='Loading...'
                >
                    <Row style={{marginBottom: "10px"}}>
                        <Col sm={12}>
                            {this.state.report !== null &&
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h2"
                                                   className="float-left"><span style={{fontWeight: "bold"}}>{this.state.report["name"]}</span></CardTitle>
                                        <Button className="float-right" onClick={() => {this.setState({editingReport: this.state.report})}} size={"sm"}>Edit Details</Button>
                                    </CardHeader>
                                    <CardBody>
                                        <Container>
                                            <Row>
                                                <Col sm={3} style={{borderRight: "1px solid black"}} className={"text-center"}>
                                                    <p>
                                                        <span style={{fontWeight: "bold"}}>Name: </span>
                                                        {this.state.report["name"]}
                                                    </p>
                                                </Col>
                                                <Col sm={3} style={{borderRight: "1px solid black"}} className={"text-center"}>
                                                    <p>
                                                        <span style={{fontWeight: "bold"}}>Description: </span>
                                                        {this.state.report["description"]}
                                                    </p>
                                                </Col>
                                                <Col sm={3} style={{borderRight: "1px solid black"}} className={"text-center"}>
                                                    <p>
                                                        <span style={{fontWeight: "bold"}}>Report Type: </span>
                                                        {this.state.reportType["name"]}
                                                    </p>
                                                </Col>
                                                <Col sm={3} className={"text-center"}>
                                                    <p>
                                                        <span style={{fontWeight: "bold"}}>Semester: </span>
                                                        {this.state.semester["description"]}
                                                    </p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12} className={"text-center"}>
                                                    <p>
                                                        <span style={{fontWeight: "bold"}}>Applicable Roles: </span>
                                                        {this.state.report["applicable_roles"].map((roleId, key) => {
                                                            return this.state.roles.filter(a => {return a["role_id"] === roleId})[0]["role_description"]
                                                        }).join(", ")}
                                                    </p>
                                                    <Alert isOpen={this.state.reportSuccess}
                                                           toggle={() => {this.setState({reportSuccess: false})}}
                                                           color="success"
                                                           fade={true}>Report successfully saved</Alert>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12} className={"text-center"}>
                                                    <p>
                                                        <span style={{fontWeight: "bold"}}>Self Reporting Enabled: </span>
                                                        {this.state.reportForm === null ? "No": "Yes"}
                                                        <Button size={"sm"} style={{marginLeft: "10px"}} onClick={() => {this.editForm()}}>{this.state.reportForm === null ? "Create Form" : "Edit Form"}</Button>
                                                    </p>
                                                    <Alert isOpen={this.state.formSuccess}
                                                           toggle={() => {this.setState({formSuccess: false})}}
                                                           color="success"
                                                           fade={true}>Report form successfully saved</Alert>
                                                </Col>
                                            </Row>
                                            <Row style={{marginTop: "20px"}}>
                                                <Col sm={3} className={"text-center"}>
                                                    <Button onClick={() => {this.setState({viewType: "totals"})}}>View Totals</Button>
                                                </Col>
                                                <Col sm={3} className={"text-center"}>
                                                    <Button onClick={() => {this.setState({viewType: "individual"})}}>View Individual</Button>
                                                </Col>
                                                <Col sm={3} className={"text-center"}>
                                                    <Button onClick={() => {this.setState({viewType: "byDescription"})}}>View By Description</Button>
                                                </Col>
                                                <Col sm={3} className={"text-center"}>
                                                    <Button onClick={() => {this.setState({viewType: "byStatus"})}}>View By Status</Button>
                                                </Col>
                                            </Row>
                                        </Container>

                                    </CardBody>
                                </Card>
                                <Modal isOpen={this.state.editingReport !== null} backdrop={true}>
                                    <ModalHeader tag={"h2"}>Edit Report</ModalHeader>
                                    <ModalBody>
                                        {this.state.editingReport !== null &&
                                        <Form>
                                            <FormGroup>
                                                <Label>Name</Label>
                                                <Input type={"text"}
                                                       value={this.state.editingReport["name"]}
                                                       required={true}
                                                       onChange={(e) => {this.setState({editingReport: {...this.state.editingReport, "name": e.target.value}})}}/>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Description</Label>
                                                <Input type={"text"}
                                                       value={this.state.editingReport["description"]}
                                                       required={true}
                                                       onChange={(e) => {this.setState({editingReport: {...this.state.editingReport, "description": e.target.value}})}}/>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Report Type</Label>
                                                <Input type={"select"}
                                                       value={this.state.editingReport["report_type_id"]}
                                                       disabled={true}>
                                                    <option value={""}>{this.state.reportType["name"]}</option>
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Semester</Label>
                                                <Input type={"select"}
                                                       value={this.state.editingReport["semester_id"]}
                                                       disabled={true}>
                                                    <option value={""}>{this.state.semester["description"]}</option>
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Applicable Roles</Label>
                                                <Multiselect
                                                    options={this.state.roles}
                                                    displayValue={"role_description"}
                                                    selectedValues={this.state.editingReport["applicable_roles"].map(a => {return this.state.roles.filter(role => {return role["role_id"] === a})[0]})}
                                                    onSelect={(e) => this.onApplicableRolesUpdate(e)}
                                                    onRemove={(e) => this.onApplicableRolesUpdate(e)}
                                                />
                                            </FormGroup>
                                        </Form>
                                        }
                                    </ModalBody>
                                    <ModalFooter>
                                        <div className="clearfix" style={{width: "100%"}}>
                                            <Button color="secondary"
                                                    className="float-right"
                                                    onClick={() => {this.saveReport()}}
                                                    style={{marginLeft: "10px"}}
                                            >Save Report</Button>
                                            <Button color="secondary"
                                                    className="float-right"
                                                    onClick={() => {this.setState({editingReport: null})}}
                                            >Cancel</Button>
                                        </div>
                                    </ModalFooter>
                                </Modal>
                                <Modal isOpen={this.state.editingForm !== null} backdrop={true}>
                                    <ModalHeader tag={"h2"}>Edit Self Submit Form</ModalHeader>
                                    <ModalBody>
                                        {this.state.editingForm !== null &&
                                        <Form>
                                            <FormGroup>
                                                <Label>Primary Entry Question</Label>
                                                <Input type={"text"}
                                                       value={this.state.editingForm["valueQuestion"]}
                                                       required={true}
                                                       onChange={(e) => {this.setState({editingForm: {...this.state.editingForm, "valueQuestion": e.target.value}})}}/>
                                            </FormGroup>
                                            {this.state.editingForm["descriptionQuestions"].map((question, key) => {
                                                return <>
                                                    <FormGroup>
                                                        <Label>Description Question #{key + 1} </Label>
                                                        <Input type={"text"}
                                                               value={question["question"]}
                                                               required={true}
                                                               onChange={(e) => {this.setState({
                                                                   editingForm: {
                                                                       ...this.state.editingForm,
                                                                       "descriptionQuestions": [
                                                                           ...this.state.editingForm.descriptionQuestions.slice(0, key),
                                                                           {
                                                                               question: e.target.value,
                                                                               answerType: this.state.editingForm.descriptionQuestions[key].answerType
                                                                           },
                                                                           ...this.state.editingForm.descriptionQuestions.slice(key + 1, this.state.editingForm.descriptionQuestions.length)
                                                                       ]
                                                                   }
                                                               })}} />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label>Description Question #{key + 1} Type</Label>
                                                        <Input type={"select"}
                                                               value={question["answerType"]}
                                                               required={true}
                                                               onChange={(e) => {this.setState({
                                                                   editingForm: {
                                                                       ...this.state.editingForm,
                                                                       "descriptionQuestions": [
                                                                           ...this.state.editingForm.descriptionQuestions.slice(0, key),
                                                                           {
                                                                               question: this.state.editingForm.descriptionQuestions[key].question,
                                                                               answerType: e.target.value
                                                                           },
                                                                           ...this.state.editingForm.descriptionQuestions.slice(key + 1, this.state.editingForm.descriptionQuestions.length)
                                                                       ]
                                                                   }
                                                               })}}>
                                                            <option value={"text"}>Text</option>
                                                            <option value={"number"}>Number</option>
                                                        </Input>
                                                    </FormGroup>
                                                </>
                                            })}

                                        </Form>
                                        }
                                        <div style={{width: "100%"}} className={"text-center"}>
                                            <Button color={"danger"}
                                                    size={"sm"}
                                                    onClick={() => {
                                                        this.setState({
                                                            editingForm: {
                                                                ...this.state.editingForm,
                                                                "descriptionQuestions": this.state.editingForm.descriptionQuestions.slice(0, this.state.editingForm.descriptionQuestions.length - 1)
                                                            }
                                                        })
                                                    }}>Delete Description Question</Button>
                                            <Button color={"secondary"}
                                                    size={"sm"}
                                                    onClick={() => {
                                                        this.setState({
                                                            editingForm: {
                                                                ...this.state.editingForm,
                                                                "descriptionQuestions": [
                                                                    ...this.state.editingForm.descriptionQuestions,
                                                                    {
                                                                        "question": "",
                                                                        "answerType": "text"
                                                                    }
                                                                ]
                                                            }
                                                        })
                                                    }}>Add Description Question</Button>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <div className="clearfix" style={{width: "100%"}}>
                                            <Button color="secondary"
                                                    className="float-right"
                                                    onClick={() => {this.saveForm()}}
                                                    style={{marginLeft: "10px"}}
                                            >Save Form</Button>
                                            <Button color="secondary"
                                                    className="float-right"
                                                    onClick={() => {this.setState({editingForm: null})}}
                                                    style={{marginLeft: "10px"}}
                                            >Cancel</Button>
                                            <Button color="danger"
                                                    className="float-right"
                                                    onClick={() => {this.deleteForm()}}
                                                    style={{marginLeft: "10px"}}
                                            >Delete Form</Button>
                                        </div>
                                    </ModalFooter>
                                </Modal>
                            </>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <Alert isOpen={this.state.deleteSuccess}
                                   toggle={() => {this.setState({deleteSuccess: false})}}
                                   color="success"
                                   fade={true}>Report entry successfully deleted</Alert>
                            {this.state.viewType === "totals" ?
                                <ReportTotals users={this.getApplicableUsers()}
                                              reportType={this.state.reportType}
                                              entries={this.state.entries} />
                            : this.state.viewType === "individual" ?
                                <IndividualView users={this.getApplicableUsers()}
                                                reportType={this.state.reportType}
                                                entries={this.state.entries}
                                                deleteReportEntry={(email, id) => {this.deleteReportEntry(email, id)}}/>
                            : this.state.viewType === "byDescription" ?
                                <p>By Description</p>
                            : this.state.viewType === "byStatus" ?
                                <p>By Status</p>
                            : null}
                        </Col>
                    </Row>
                </LoadingOverlay>
            </>
        );
    }
}

export default withRouter(ReportAdminView);
