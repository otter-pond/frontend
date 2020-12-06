import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Label,
    Row,
    FormGroup,
    Container,
    Input, Button, Table, Alert
} from "reactstrap";
import SelectReportCard from "../../components/Reporting/SelectReportCard";
import ReportingAPI from "../../api/ReportingAPI";
import UsersAPI from "../../api/UsersAPI";
import RolesAPI from "../../api/RolesAPI";
import Cookies from "universal-cookie";
import EnrollBuzzcardModal from "../../components/Attendance/EnrollBuzzcardModal";
import Notify from "react-notification-alert";

const cookies = new Cookies();
let permissions = cookies.get("permissions")

class Attendance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedReportId: "",
            reportName: "",
            reportOptions: [],
            selectedOption: "",
            attendanceDescription: "",
            users: [],
            applicableUsers: [],
            entries: [],
            presetDescriptions: [],
            pendingDescriptionSelect: "",
            scanning: false,
            pendingDescriptionText: "Chapter Attendance " + (new Date()).toLocaleDateString('en-US'),
            errorText: "",
            manualEntry: "",
            selectedUser: "",
        };

        this.scanRead = "";

        this.reportingAPI = new ReportingAPI()
        this.usersAPI = new UsersAPI();
        this.rolesAPI = new RolesAPI();
        this.usersAPI.getUsers().then(users => {
            this.setState({
                users: users
            })
        }).catch(e => {
            var options = {
                place: "tc",
                message: `Error executing request`,
                type: "danger",
                autoDismiss: -1,
                closeButton: true
            };
            this.refs.notify.notificationAlert(options);
        })
    }

    addListener(){
        // have to track the listener so i can remove it
        this.listener = (e) => {this.handleKeyPress(e)}
        document.addEventListener("keypress", this.listener, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keypress", this.listener);
    }

    handleKeyPress(e) {
        if (e.keyCode === 59) { // semicolon
            // Start of scan
            this.setState({
                scanning: true
            });
            e.preventDefault();
            return;
        }
        if (this.state.scanning) {
            e.preventDefault();
            if (e.keyCode === 13) { // Enter
                this.handleSwipe();
                this.scanRead = "";
                return;
            }
            // Append the next key to the end of the list
            this.scanRead += e.key
        }
    }

    handleSwipe(manual) {
        let gtid;
        if (manual)
            gtid = manual;
        else
            gtid = this.scanRead.split("=")[1];
        let cookies = new Cookies();
        let username = cookies.get("user_email", {path: "/"})
        let report = {
            gtid: gtid,
            value: this.state.selectedOption,
            description: this.state.attendanceDescription,
            timestamp: (new Date()).toISOString(),
            entered_by_email: username
        }
        this.makeNewReportEntryForReport(report)
    }

    handleDropDownSelect(user_email) {
        let cookies = new Cookies();
        let username = cookies.get("user_email", {path: "/"})
        let report = {
            user_email: user_email,
            value: this.state.selectedOption,
            description: this.state.attendanceDescription,
            timestamp: (new Date()).toISOString(),
            entered_by_email: username
        }
        this.makeNewReportEntryForReport(report)
    }

    makeNewReportEntryForReport(report) {
        this.reportingAPI.createReportEntry(this.state.selectedReportId, report, true).then(result => {
            if (result["error"] !== "Success"){
                this.setState({
                    errorText: result["error"],
                    scanning: false
                })
            } else {
                this.loadEntries()
                this.setState({
                    scanning: false,
                    errorText: ""
                });
            }
        }).catch(e => {
            var options = {
                place: "tc",
                message: `Error executing request`,
                type: "danger",
                autoDismiss: -1,
                closeButton: true
            };
            this.refs.notify.notificationAlert(options);
        })
    }

    loadAllApplicableUsersForReport(reportId) {
        let applicableUsers = [];

        this.reportingAPI.getApplicableUsers(reportId).then(users => {
            if (users != null) {
                for (let index in users) {
                    let user = users[index]
                    applicableUsers.push(user)
                }
                this.setState({applicableUsers: applicableUsers})
            }
        })
    }


    selectReport(reportId) {
        this.reportingAPI.getReportById(reportId).then(report => {
            if (report != null) {
                this.reportingAPI.getReportTypeById(report["report_type_id"]).then(report_type => {
                    if (report_type["value_type"] === "optionselect") {
                        let presetDescriptions = [];
                        let pendingDescriptionSelect = "";
                        if (report["preset_descriptions"]){
                            presetDescriptions = report["preset_descriptions"]
                            pendingDescriptionSelect = presetDescriptions[0];
                        }
                        this.setState({
                            selectedReportId: reportId,
                            reportName: report["name"],
                            reportOptions: report_type["options"],
                            selectedOption: report_type["options"][0],
                            presetDescriptions: presetDescriptions,
                            pendingDescriptionSelect: pendingDescriptionSelect
                        });
                        this.loadUsersAndRoles(report["applicable_roles"])
                        this.loadAllApplicableUsersForReport(this.state.selectedReportId)
                    }
                })
            }
        }).catch(e => {
            var options = {
                place: "tc",
                message: `Error executing request`,
                type: "danger",
                autoDismiss: -1,
                closeButton: true
            };
            this.refs.notify.notificationAlert(options);
        })
    }

    loadEntries() {
        this.reportingAPI.getReportEntries(this.state.selectedReportId).then(entries => {
            let applicable_entries = entries.filter(a => {
                return a["description"] === this.state.attendanceDescription;
            });
            applicable_entries.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp)
            })
            this.setState({
                entries: applicable_entries
            })
        }).catch(e => {
            var options = {
                place: "tc",
                message: `Error executing request`,
                type: "danger",
                autoDismiss: -1,
                closeButton: true
            };
            this.refs.notify.notificationAlert(options);
        })
    }

    loadUsersAndRoles(role_ids) {
        let users_details = [];
        this.usersAPI.getUsers().then(users => {
            for (let index in role_ids) {
                let role = role_ids[index]
                let promises = [this.rolesAPI.getRoleById(role), this.rolesAPI.getUsersWithRole(role)]
                Promise.all(promises).then(results => {
                    let role = results[0];
                    let user_emails = results[1];
                    for (let index in user_emails) {
                        let user_email = user_emails[index];
                        let user = users.filter(a => {return a["user_email"] === user_email})[0]
                        let user_details = {
                            "user_email": user_email,
                            "role": role["role_description"],
                            "name": user["first_name"] + " " + user["last_name"]
                        }
                        users_details.push(user_details)
                    }
                    this.setState({users: users_details})
                })
            }
        }).catch(e => {
            var options = {
                place: "tc",
                message: `Error executing request`,
                type: "danger",
                autoDismiss: -1,
                closeButton: true
            };
            this.refs.notify.notificationAlert(options);
        })

    }

    calculateSummaries(users, entries) {
        let summaries = {}
        entries.forEach(entry => {
            let user = users.filter(a => {return a["user_email"] === entry["user_email"]})[0];
            if (!user) {
                return;
            }
            let role = user["role"]
            let key = role + " (" + entry["value"]+ ")";
            if (key in summaries) {
                summaries[key]++
            } else {
                summaries[key] = 1;
            }
        })
        return summaries;
    }

    formatTime(timestamp) {
        let date = new Date(timestamp);
        let string = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        return string;
    }


    render() {
        let summaries = this.calculateSummaries(this.state.users, this.state.entries);
        return (
            <>
                <Notify ref="notify"/>
                <div className="content">
                    <h1>Chapter Attendance</h1>
                    {this.state.selectedReportId === "" ?
                        <Row>
                            <Col xs={12}>
                                <SelectReportCard onSelect={(reportId) => {this.selectReport(reportId)}} enableAdmin={false}/>
                            </Col>
                        </Row>
                    : null }
                    <Row>
                        <Col xs={8}>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h2" className="float-left">Attendance</CardTitle>
                                    {this.state.selectedReportId !== "" &&
                                    <>
                                        <Button className={"float-right"}  size={"sm"} onClick={() => {this.setState({enrollBuzzcard: true})}}>Enroll Buzzcard</Button>
                                        <EnrollBuzzcardModal users={this.state.users} isOpen={this.state.enrollBuzzcard} close={() => {this.setState({enrollBuzzcard: false})}} />
                                    </>}
                                </CardHeader>
                                <CardBody>
                                    {this.state.selectedReportId === "" ? <p>Select a report above to take attendance</p> :
                                        this.state.attendanceDescription === "" ? this.renderSetDescription() : this.renderAttendanceDetails()}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs={4}>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h2" className="float-left">Summary</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    {Object.keys(summaries).map((key, index) => {
                                        return <p key={index}>{key}: {summaries[key]}</p>
                                    })}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h2" className="float-left">Attendance Details</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Description</th>
                                            <th>Value</th>
                                            <th>Timestamp</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.entries.map((entry, index) => {
                                            let user = this.state.users.filter(a => {return a["user_email"] === entry["user_email"]})[0]
                                            return(
                                                <tr key={index}>
                                                    <td>{user["name"]}</td>
                                                    <td>{user["role"]}</td>
                                                    <td>{entry["description"]}</td>
                                                    <td>{entry["value"]}</td>
                                                    <td>{this.formatTime(entry["timestamp"])}</td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }


    updateOption(e) {
        let option = e.target.value;
        this.setState({
            selectedOption: option
        })
    }

    updateManualEntry(e) {
        this.setState({
            manualEntry: e.target.value
        })
    }

    entryKeyUp(e) {
        if (e.key === "Enter") {
            this.submitManualEntry();
        }
    }

    updateSelectedUser(e) {
        this.setState( {
            selectedUser: e.target.value
        }, () => {
            this.handleDropDownSelect(this.state.selectedUser)
        })
    }

    submitManualEntry() {
        let swipe = this.state.manualEntry;
        this.setState({
            manualEntry: ""
        }, () => {
            this.handleSwipe(swipe)
        })
    }

    renderAttendanceDetails() {
        return <div>
            <Row>
                <Col sm={2}><Label>Selected Report</Label></Col>
                <Col sm={3}><p>{this.state.reportName}</p></Col>
            </Row>
            <Row>
                <Col sm={2}><Label>Description</Label></Col>
                <Col sm={3}><p>{this.state.attendanceDescription}</p></Col>
            </Row>
            <FormGroup row>
                <Label for="optionSelect" sm={2}>Attendance Option</Label>
                <Col sm={3}>
                    <Input type="select" name="selectedOption" id={"option"} defaultValue={this.state.selectedOption} onChange={(e) => {this.updateOption(e)}}>
                        {this.state.reportOptions.map((value, index) => {
                            return <option key={index}>{value}</option>
                        })}
                    </Input>
                </Col>
            </FormGroup>
            <div hidden={!permissions.includes("full_admin")}>
                <Row>
                    <Col sm={2}>
                        <h4 className={"float-left"}>(Full Admin) Select User:</h4>
                    </Col>
                    <Col sm={3}>
                        <Input type="select" name="selectUser" id={"selectUser"}
                               defaultValue={this.state.selectedUser}
                               onChange={(e) => {this.updateSelectedUser(e)}}>
                            <option key={"default"}>(Select a user)</option>
                            {this.state.applicableUsers.map((value, index) => {
                                return <option key={index} value={value["user_email"]}>{value["first_name"] + " " + value["last_name"]}</option>
                            })}
                        </Input>
                    </Col>
                </Row>
            </div>
            {this.state.scanning ? <h4>Scanning...</h4> :
                <div className={"clearfix"}>
                    <div className={"clearfix"}>
                        <h4 className={"float-left"}>Ready to scan! Or enter GTID manually: </h4>
                        <Input className={"float-left"} style={{width: 100, marginLeft: 40, marginRight: 10}} type="text" name="manualEntry" id={"manualEntry"} onChange={(e) => {this.updateManualEntry(e)}} onKeyUp={(e) => {this.entryKeyUp(e)}} value={this.state.manualEntry}/>
                        <Button className={"float-left"} size="sm" onClick={() => {this.submitManualEntry()}}>Submit</Button>
                    </div>

                </div>
            }
            <Alert color="danger" isOpen={this.state.errorText !== ""} toggle={() => {this.setState({errorText: ""})}}>
                Error: {this.state.errorText}
            </Alert>
        </div>
    }

    selectExistingDescription(e) {
        this.setState({
            attendanceDescription: this.state.pendingDescriptionSelect
        }, () => {
            this.addListener();
            this.loadEntries()
        });
    }

    createNewDescription(e) {
        let description = this.state.pendingDescriptionText;
        this.reportingAPI.addDescription(this.state.selectedReportId, description).then(result=>{
            if (result["error"] !== "Success") {
                console.log(result);
            } else {
                this.setState({
                    attendanceDescription: description
                }, () => {
                    this.addListener();
                    this.loadEntries();
                })
            }
        })
    }

    renderSetDescription() {
        return <div>
            <p>Select an existing attendance description or create a new one</p>
            <Container>
                <Row>
                    <Col xs={4} className="clearfix text-center">
                        <Input type="text" name="newDescription" id={"newDescription"}
                               defaultValue={this.state.pendingDescriptionText}
                               onChange={(e) => {this.setState({pendingDescriptionText: e.target.value})}}/>
                        <Button className="center" onClick={() => this.createNewDescription()}>Create New Description</Button>
                    </Col>
                    <Col xs={2}></Col>
                    <Col xs={4} className="clearfix text-center">
                        <Input type="select" name="existingDescription" id={"existingDescription"}
                               defaultValue={this.state.pendingDescriptionSelect}
                               onChange={(e) => {this.setState({pendingDescriptionSelect: e.target.value})}}>
                            {this.state.presetDescriptions.map((value, index) => {
                                return <option key={index}>{value}</option>
                            })}
                        </Input>
                        <Button className="center" onClick={() => this.selectExistingDescription()}>Use Existing Description</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    }
}

export default Attendance;
