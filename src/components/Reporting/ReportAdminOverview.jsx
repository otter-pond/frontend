import React, { Component } from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Table, ModalHeader, ModalBody, ModalFooter, Button, Modal,
    Form, FormGroup, Input, Label, Alert
} from "reactstrap"
import ReportingAPI from "../../api/ReportingAPI";
import LoadingOverlay from "react-loading-overlay";
import RolesAPI from "../../api/RolesAPI";
import PositionsAPI from "../../api/PositionsAPI";
import {Multiselect} from "multiselect-react-dropdown";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class ReportAdminOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminReports: [],
            semesters: [],
            types: [],
            roles: [],
            permissions: [],
            loading: true,
            editingSemester: null,
            successSemester: false,
            editingType: null,
            successType: false,
            editingReport: null,
            successReport: false
        };

        this.reportingApi = new ReportingAPI();
        this.rolesApi = new RolesAPI();
        this.positionsApi = new PositionsAPI();

        this.permissions = cookies.get("permissions")

        this.loadAll();

        this.positionsApi.getAllPermissions().then(permissions => {
            this.setState({
                permissions: permissions
            })
        })
    }

    manageReporting() {
        return this.permissions.includes("can_manage_permissions") || this.permissions.includes("full_admin")
    }

    loadAll() {
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

    createNewSemester() {
        this.setState({
            editingSemester: {
                start_date: null,
                end_date: null,
                description: ""
            }
        })
    }

    createNewType() {
        this.setState({
            editingType: {
                "name": "",
                "value_type": "numeric",
                "status_options": {},
                "management_permissions": []
            }
        })
    }

    createNewReport() {
        this.setState({
            editingReport: {
                "name": "",
                "description": "",
                "report_type_id": "",
                "semester_id": "",
                "applicable_roles": []
            }
        })
    }

    saveSemester() {
        var promise = null;
        if (this.state.editingSemester.hasOwnProperty("semester_id")) {
            promise = this.reportingApi.updateSemester(this.state.editingSemester["semester_id"], this.state.editingSemester)
        } else {
            promise = this.reportingApi.createSemester(this.state.editingSemester)
        }
        promise.then(result => {
            this.setState({
                editingSemester: null,
                successSemester: true,
                loading: true
            }, () => {
                this.loadAll()
            })
        })
    }

    saveType() {
        var promise = null;
        let type = this.state.editingType;
        if (type["status_options"].hasOwnProperty("default_status") && type["status_options"]["default_status"] === 'None') {
            type["status_options"]["default_status"] = null
        }
        if (type["status_options"].hasOwnProperty("approved_status") && type["status_options"]["approved_status"] === 'None') {
            type["status_options"]["approved_status"] = null
        }
        if (!type["status_options"].hasOwnProperty("statuses")) {
            type["status_options"] = null
        }
        if (type.hasOwnProperty("report_type_id")) {
            promise = this.reportingApi.updateReportType(type["report_type_id"], type)
        } else {
            promise = this.reportingApi.createReportType(type)
        }
        promise.then(result => {
            this.setState({
                editingType: null,
                successType: true,
                loading: true
            }, () => {
                this.loadAll()
            })
        })
    }

    saveReport() {
        let report = this.state.editingReport;
        this.reportingApi.createReport(report).then(report => {
            this.setState({
                editingReport: null,
                successReport: true,
                loading: true
            }, () => {
                this.loadAll();
            })
        })
    }

    onPermissionUpdate(e) {
        let type = this.state.editingType
        type["management_permissions"] = e.map(a => a["name"])
        this.setState({
            editingType: type
        })
    }

    onApplicableRolesUpdate(e) {
        let report = this.state.editingReport;
        report["applicable_roles"] = e.map(a => a["role_id"]);
        this.setState({
            editingReport: report
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
                                {this.manageReporting() && <Button className="float-right" onClick={() => {this.createNewReport()}}>Create New</Button>}
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
                                {this.manageReporting() && <Button className="float-right" onClick={() => {this.createNewType()}}>Create New</Button>}
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
                                {this.manageReporting() && <Button className="float-right" onClick={() => {this.createNewSemester()}}>Create New</Button>}
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
                    <Table striped={true} hover>
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
                                           onChange={(e) => {this.setState({
                                               editingReport: {
                                                   ...this.state.editingReport,
                                                   "report_type_id": e.target.value,
                                               }
                                           })}}>
                                        <option value={""}>Select Report Type</option>
                                        {this.state.types.map((type, key) => {
                                            return <option value={type["report_type_id"]} key={key}>{type["name"]}</option>
                                        })}
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Semester</Label>
                                    <Input type={"select"}
                                           value={this.state.editingReport["semester_id"]}
                                           onChange={(e) => {this.setState({
                                               editingReport: {
                                                   ...this.state.editingReport,
                                                   "semester_id": e.target.value,
                                               }
                                           })}}>
                                        <option value={""}>Select Semester</option>
                                        {this.state.semesters.map((type, key) => {
                                            return <option value={type["semester_id"]} key={key}>{type["description"]}</option>
                                        })}
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
                </div>
            </>
        )
    }


    renderReportTypes() {
        const valueTypeMap = {
            "numeric": "Numeric",
            "financial": "Financial",
            "optionselect": "Option Select"
        }
        return (
            <div style={{maxHeight: "300px", overflowY: "scroll"}}>
                <Alert isOpen={this.state.successType}
                       toggle={() => {this.setState({successType: false})}}
                       color="success"
                       fade={true}>Report type successfully saved</Alert>
                <Table striped={true} hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Value Type</th>
                            <th>Required Permissions</th>
                        </tr>
                    </thead>
                    <tbody style={{cursor: "pointer"}}>
                    {this.state.types.map((type, index) => {
                        return (
                            <tr onClick={() => {this.manageReporting() && this.setState({editingType: JSON.parse(JSON.stringify(type))})}} key={index}>
                                <td>{type["name"]}</td>
                                <td>{valueTypeMap[type["value_type"]]}</td>
                                <td>{type["management_permissions"].join(", ")}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
                <Modal isOpen={this.state.editingType !== null} backdrop={true}>
                    <ModalHeader tag={"h2"}>Edit Report Type</ModalHeader>
                    <ModalBody>
                        {/*BOY THIS IS MESSY PLEASE DON'T HATE ME IF YOU'RE TRYING TO DEBUG IT I'M SORRY*/}
                        {this.state.editingType !== null &&
                        <Form disabled>
                            {this.state.editingType.hasOwnProperty("report_type_id") ?
                                <p>Contact Daniel Becker if you need to update options or statuses</p>
                                :
                                <p>I would highly recommend using the API to create new report types as this form is
                                    a finicky bitch. Proceed at your own risk</p>
                            }
                            <FormGroup>
                                <Label>Name</Label>
                                <Input type={"text"}
                                       value={this.state.editingType["name"]}
                                       onChange={(e) => {this.setState({editingType: {...this.state.editingType, "name": e.target.value}})}}/>
                            </FormGroup>
                            <FormGroup>
                                <Label>Management Permissions</Label>
                                <Multiselect
                                    options={this.state.permissions}
                                    displayValue={"name"}
                                    selectedValues={this.state.editingType["management_permissions"].map(a => {return {name: a}})}
                                    onSelect={(e) => this.onPermissionUpdate(e)}
                                    onRemove={(e) => this.onPermissionUpdate(e)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Value Type</Label>
                                <Input type={"select"}
                                       value={this.state.editingType["value_type"]}
                                       onChange={(e) => {this.setState({
                                           editingType: {
                                               ...this.state.editingType, "value_type": e.target.value,
                                               options: e.target.value === "optionselect" ? [""] : null
                                           }
                                       })}}
                                       disabled={this.state.editingType.hasOwnProperty("report_type_id")}>
                                    <option value={"numeric"}>Numeric</option>
                                    <option value={"financial"}>Financial</option>
                                    <option value={"optionselect"}>Option Select</option>
                                </Input>
                            </FormGroup>

                            {this.state.editingType["value_type"] === "optionselect" &&
                                <FormGroup>
                                    <Label>Options {!this.state.editingType.hasOwnProperty("report_type_id") &&
                                        <>
                                            <Button size={"sm"} onClick={() => {this.setState({
                                                editingType: {
                                                    ...this.state.editingType,
                                                    options: [...this.state.editingType["options"], ""]
                                                }
                                            })}}>Add</Button>
                                            <Button size={"sm"} color={"danger"} onClick={() => {this.setState({
                                                editingType: {
                                                    ...this.state.editingType,
                                                    options: [...this.state.editingType["options"].slice(0, this.state.editingType["options"].length - 1)]
                                                }
                                            })}}>Remove</Button>
                                        </>
                                    }
                                    </Label>
                                    {this.state.editingType["options"].map((option, index) => {
                                        if (this.state.editingType.hasOwnProperty("report_type_id"))
                                            return <p>- {option}</p>
                                        return <Input type={"text"}
                                                      value={option}
                                                      key={index}
                                                      style={{margin: "5px"}}
                                                      onChange={(e) => {
                                                          this.setState({
                                                              editingType: {
                                                                  ...this.state.editingType,
                                                                  options: [
                                                                      ...this.state.editingType["options"].slice(0, index),
                                                                      e.target.value,
                                                                      ...this.state.editingType["options"].slice(index + 1, this.state.editingType["options"].length)
                                                                  ]
                                                              }
                                                          })
                                                      }}/>
                                    })}
                                </FormGroup>
                            }
                            <FormGroup>
                                <Label>
                                    Use Report Statuses
                                </Label>
                                <Input type={"checkbox"}
                                       style={{marginLeft: "10px"}}
                                       disabled={this.state.editingType.hasOwnProperty("report_type_id")}
                                       checked={this.state.editingType["status_options"].hasOwnProperty("statuses")}
                                       onChange={(e) => {this.setState({editingType: {...this.state.editingType, "status_options": e.target.checked ? {
                                           "statuses": [""],
                                           "default_status": null,
                                           "approved_status": null
                                       } : {}}})}}/>
                            </FormGroup>
                            {this.state.editingType["status_options"].hasOwnProperty("statuses") &&
                                <>
                                <FormGroup>
                                    <Label>Possbile Statuses {!this.state.editingType.hasOwnProperty("report_type_id") &&
                                    <>
                                        <Button size={"sm"} onClick={() => {this.setState({
                                            editingType: {
                                                ...this.state.editingType,
                                                "status_options": {
                                                    ...this.state.editingType["status_options"],
                                                    statuses: [...this.state.editingType["status_options"]["statuses"], ""]
                                                }
                                            }
                                        })}}>Add</Button>
                                        <Button size={"sm"} color={"danger"} onClick={() => {this.setState({
                                            editingType: {
                                                ...this.state.editingType,
                                                "status_options": {
                                                    ...this.state.editingType["status_options"],
                                                    statuses: [...this.state.editingType["status_options"]["statuses"].slice(0, this.state.editingType["status_options"]["statuses"].length - 1)]
                                                }
                                            }
                                        })}}>Remove</Button>
                                    </>
                                    }</Label>
                                    {this.state.editingType["status_options"]["statuses"].map((status, index) => {
                                        if (this.state.editingType.hasOwnProperty("report_type_id"))
                                            return <p key={index}>- {status}</p>
                                        return <Input type={"text"}
                                                      value={status}
                                                      key={index}
                                                      style={{margin: "5px"}}
                                                      onChange={(e) => {
                                                          this.setState({
                                                              editingType: {
                                                                  ...this.state.editingType,
                                                                  status_options: {
                                                                      ...this.state.editingType["status_options"],
                                                                      statuses: [
                                                                          ...this.state.editingType["status_options"]["statuses"].slice(0, index),
                                                                          e.target.value,
                                                                          ...this.state.editingType["status_options"]["statuses"].slice(index + 1, this.state.editingType["status_options"]["statuses"].length)
                                                                      ]
                                                                  }

                                                              }
                                                          })
                                                      }}/>
                                    })}
                                </FormGroup>
                                <FormGroup>
                                    <Label>Default Status</Label>
                                    <Input type={"select"}
                                           value={this.state.editingType["status_options"]["default_status"]}
                                           onChange={(e) => {this.setState({
                                               editingType: {
                                                   ...this.state.editingType,
                                                   "status_options": {
                                                       ...this.state.editingType["status_options"],
                                                       "default_status": e.target.value
                                                   }
                                               }
                                           })}}>
                                        <option value={null}>None</option>
                                        {this.state.editingType["status_options"]["statuses"].map((status, index) => {
                                            return <option value={status} key={index}>{status}</option>
                                        })}
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Approved Status</Label>
                                    <Input type={"select"}
                                           value={this.state.editingType["status_options"]["approved_status"]}
                                           onChange={(e) => {this.setState({
                                               editingType: {
                                                   ...this.state.editingType,
                                                   "status_options": {
                                                       ...this.state.editingType["status_options"],
                                                       "approved_status": e.target.value
                                                   }
                                               }
                                           })}}>
                                        <option value={null}>None</option>
                                        {this.state.editingType["status_options"]["statuses"].map((status, index) => {
                                            return <option value={status} key={index}>{status}</option>
                                        })}
                                    </Input>
                                </FormGroup>
                                </>
                            }
                        </Form>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <div className="clearfix" style={{width: "100%"}}>
                            <Button color="secondary"
                                    className="float-right"
                                    onClick={() => {this.saveType()}}
                                    style={{marginLeft: "10px"}}
                            >Save Report Type</Button>
                            <Button color="secondary"
                                    className="float-right"
                                    onClick={() => {this.setState({editingType: null})}}
                            >Cancel</Button>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

    renderSemesters() {
        return (
            <div style={{maxHeight: "300px", overflowY: "scroll"}}>
                <Alert isOpen={this.state.successSemester}
                       toggle={() => {this.setState({successSemester: false})}}
                       color="success"
                       fade={true}>Semester successfully saved</Alert>
                <Table striped={true} hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                    </thead>
                    <tbody style={{cursor: "pointer"}}>
                    {this.state.semesters.map((semester, index) => {
                        return (
                            <tr onClick={() => {this.manageReporting() && this.setState({editingSemester: semester})}} key={index}>
                                <td>{semester["description"]}</td>
                                <td>{semester["start_date"]}</td>
                                <td>{semester["end_date"]}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
                <Modal isOpen={this.state.editingSemester !== null} backdrop={true}>
                    <ModalHeader tag={"h2"}>Edit Semester</ModalHeader>
                    <ModalBody>
                        {this.state.editingSemester !== null &&
                        <Form>
                            <FormGroup>
                                <Label>Name</Label>
                                <Input type={"text"}
                                       value={this.state.editingSemester["description"]}
                                       required={true}
                                       onChange={(e) => {this.setState({editingSemester: {...this.state.editingSemester, "description": e.target.value}})}}/>
                            </FormGroup>
                            <FormGroup>
                                <Label>Start Date</Label>
                                <Input type={"date"}
                                       value={this.state.editingSemester["start_date"]}
                                       required={true}
                                       onChange={(e) => {this.setState({editingSemester: {...this.state.editingSemester, "start_date": e.target.value}})}}/>
                            </FormGroup>
                            <FormGroup>
                                <Label>End Date</Label>
                                <Input type={"date"}
                                       value={this.state.editingSemester["end_date"]}
                                       required={true}
                                       onChange={(e) => {this.setState({editingSemester: {...this.state.editingSemester, "end_date": e.target.value}})}}/>
                            </FormGroup>
                        </Form>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <div className="clearfix" style={{width: "100%"}}>
                            <Button color="secondary"
                                    className="float-right"
                                    onClick={() => {this.saveSemester()}}
                                    style={{marginLeft: "10px"}}
                            >Save Semester</Button>
                            <Button color="secondary"
                                    className="float-right"
                                    onClick={() => {this.setState({editingSemester: null})}}
                            >Cancel</Button>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ReportAdminOverview;
