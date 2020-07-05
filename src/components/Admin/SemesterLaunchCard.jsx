import React, { Component } from "react";
import {
    Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Label, Input, Alert, Button
} from "reactstrap"
import AdminAPI from "../../api/AdminAPI";
import LoadingOverlay from "react-loading-overlay";

class SemesterLaunchCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semesterDescription: "",
            startDate: "",
            endDate: "",
            financesRolloverId: "",
            loading: false,
            showError: false,
            showSuccess: false
        }

        this.adminApi = new AdminAPI();
    }

    submitForm() {
        if (this.state.semesterDescription === "" || this.state.startDate === "" || this.state.endDate === "" || this.state.financesRolloverId === "") {
            this.setState({
                showError: true
            });
            return
        }
        let launchConfig = {
            "semester_description": this.state.semesterDescription,
            "semester_start_date": this.state.startDate,
            "semester_end_date": this.state.endDate,
            "other_variables": {
                "financesRolloverId": this.state.financesRolloverId
            }
        }

        this.setState({
            loading: true
        }, () => {
            this.adminApi.launchSemester(launchConfig).then(result => {
                this.setState({
                    loading: false,
                    semesterDescription: "",
                    startDate: "",
                    endDate: "",
                    financesRolloverId: "",
                    showSuccess: true
                })
            })
        })
    }

    render() {
        return (
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle tag="h2" className="float-left">Launch New Semester</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <LoadingOverlay
                            active={this.state.loading}
                            spinner
                            text='Loading...'
                        >
                            <Alert color="danger" isOpen={this.state.showError} toggle={() => {this.setState({showError: !this.state.showError})}}>
                                Error launching new semester
                            </Alert>
                            <Alert color="success" isOpen={this.state.showSuccess} toggle={() => {this.setState({showSuccess: !this.state.showSuccess})}}>
                                Successfully launched new semester
                            </Alert>
                            <Form>
                                <FormGroup>
                                    <Label>Semester Description (i.e. Fall 2020)</Label>
                                    <Input type={"text"} value={this.state.semesterDescription}
                                           onChange={e => {this.setState({semesterDescription: e.target.value})}} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Semester Start Date</Label>
                                    <Input type={"date"} value={this.state.startDate}
                                           onChange={e => {this.setState({startDate: e.target.value})}} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Semester End Date</Label>
                                    <Input type={"date"} value={this.state.endDate}
                                           onChange={e => {this.setState({endDate: e.target.value})}} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Finances Form to Rollover From</Label>
                                    <Input type={"text"} value={this.state.financesRolloverId}
                                           onChange={e => {this.setState({financesRolloverId: e.target.value})}} />
                                </FormGroup>
                                <Button onClick={() => {this.submitForm()}}>Launch New Semester</Button>
                            </Form>
                        </LoadingOverlay>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default SemesterLaunchCard;
