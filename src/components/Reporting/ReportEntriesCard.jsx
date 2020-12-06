import React, { Component } from "react";

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown, Alert
} from "reactstrap"
import ReportingAPI from "../../api/ReportingAPI";
import UsersAPI from "../../api/UsersAPI";
import LoadingOverlay from "react-loading-overlay";
import PaymentModal from "../Payment/PaymentModal";
import ReportEntryForm from "./ReportEntryForm";
import Cookies from 'universal-cookie';
import Notify from "react-notification-alert";

class ReportEntriesCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            report: {},
            entries: [],
            summary: null,
            selectedIndividual: "",
            user: null,
            payNow: false,
            paymentAmount: 0.0,
            form: null,
            showFormEntry: false,
            showSuccessAlert: false,
        }

        this.reportingApi = new ReportingAPI();
        this.usersApi = new UsersAPI();

        if (this.props.reportId != null && this.props.reportId !== "") {
            if (this.props.selectedIndividual !== null && this.props.selectedIndividual !== "") {
                this.loadReport(this.props.reportId, this.props.selectedIndividual)
            } else {
                this.loadReport(this.props.reportId)
            }

        }
    }

    loadReport(reportId, selectedIndividual = "") {
        let reportPromise = this.reportingApi.getUserReportEntries(reportId, selectedIndividual)
        let reportFormPromise = this.reportingApi.getReportFormById(reportId);
        let promises = [reportPromise, this.reportingApi.getReportById(reportId), reportFormPromise]
        if (selectedIndividual !== "") {
            promises.push(this.usersApi.getUserByEmail(selectedIndividual))
        }
        Promise.all(promises).then(results => {
            let report = results[1];
            let entries = results[0];
            let form = results[2]["valueQuestion"] == null ? null: results[2];
            let user = null;
            if (selectedIndividual !== "") {
                user = results[3]
            }
            if (entries == null || entries.length === 0) {
                this.setState({
                    report: report,
                    entries: [],
                    summary: null,
                    loading: false,
                    user: user,
                    selectedIndividual: selectedIndividual,
                    form: form
                });
                return;
            }
            var summary;
            if (this.props.sortDirection){
                entries.sort((a, b) => {
                    if (this.props.sortDirection === "asc") {
                        return new Date(a.timestamp) - new Date(b.timestamp);
                    } else if (this.props.sortDirection === "desc"){
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    }
                })
            }
            if (report["report_type"]["value_type"] === "optionselect") {
                let options = report["report_type"]["options"];
                let optionsMap = {}
                options.forEach(option => {
                    optionsMap[option] = 0;
                })
                entries.forEach(entry => {
                    optionsMap[entry["value"]]++;
                });
                summary = optionsMap
            } else {
                let total = 0;
                entries.forEach(entry => {
                    if (typeof entry["value"] == "string") {
                        entry["value"] = parseFloat(entry["value"]);
                    }
                    total += entry["value"]
                });
                summary = total
            }

            this.setState({
                entries: entries,
                report: report,
                summary: summary,
                user: user,
                selectedIndividual: selectedIndividual,
                loading: false,
                form: form
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

    payNow() {
        this.setState({
            payNow: true,
            paymentAmount: this.state.summary.toFixed(2)
        })
    }

    componentDidUpdate(prevProps){
        if (this.props.reportId !== prevProps.reportId || this.props.selectedIndividual !== prevProps.selectedIndividual) {
            this.setState({
                loading: true
            }, () => {
                this.loadReport(this.props.reportId, this.props.selectedIndividual)
            })

        }
    }

    formatValue(report, value) {
        if (report != null) {
            if (report["report_type"]["value_type"] === "financial") {
                let fixed = value.toFixed(2);
                if (value < 0) {
                    return "-$" + Math.abs(fixed)
                }
                return "$" + fixed;
            }
        }
        return value;
    }

    formatDate(date) {
        try{
            return new Date(date).toLocaleDateString();
        } catch(e) {
            console.log("Unable to format date")
            return "Invalid Date"
        }
    }

    formatSummary(report, summary) {
        if (report != null && report.hasOwnProperty("report_type") && summary != null) {
            if (report["report_type"]["value_type"] === "financial") {
                let fixed = summary.toFixed(2);
                if (fixed < 0) {
                    return "Total: -$" + Math.abs(fixed)
                }
                if (fixed == 0){
                    return "Total: $0.00"
                }
                if (this.state.selectedIndividual === "") { // User viewing their own
                    return <span>Total: $  {fixed} <Button size={"sm"} onClick={() => {this.payNow()}}>Pay Now</Button></span>;
                }
                return "Total: $" + fixed;
            } else if (report["report_type"]["value_type"] === "optionselect") {
                return (<span>
                    {Object.keys(summary).map((option, index) => {
                        return <span>{option}: {summary[option]}<br /></span>
                    })}
                </span>)
            } else {
                return "Total: " + summary
            }
        }
    }

    formatDescription(description) {
        let formattedDescriptions = []
        let splitDescriptions = description.split("\n");
        for (let index in splitDescriptions) {
            let descriptionString = splitDescriptions[index];
            let splitDescription = descriptionString.split("\t");
            if (splitDescription.length > 1) {
                let temp = "<span style='font-weight: bold'>" + splitDescription[0] + " </span> " + splitDescription[1];
                formattedDescriptions[index] = temp
            } else {
                formattedDescriptions[index] =  splitDescription[0];
            }
        }

        let descriptionHtml = formattedDescriptions.join("<br />");
        return <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
    }

    newEntry() {
        this.setState({
            showFormEntry: true
        })
    }

    submitReportEntry(entry) {
        entry["timestamp"] = new Date();

        let cookies = new Cookies();
        let user_email = cookies.get("user_email")

        if (this.state.selectedIndividual !== "") {
            entry["user_email"] = this.state.selectedIndividual
        } else {
            entry["user_email"] = user_email
        }

        entry["entered_by_email"] = user_email

        let entryText = JSON.stringify(entry);
        let newEntry = JSON.parse(entryText);

        this.reportingApi.submitReportEntry(this.state.report["report_id"], newEntry).then(result => {
            this.setState({
                showFormEntry: false,
                showSuccessAlert: true,
                loading: true
            }, () => {
                this.loadReport(this.state.report["report_id"], this.state.selectedIndividual)
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

    render() {
        var entryType = null;
        if (this.state.report.hasOwnProperty("report_type") && this.state.report["report_type"].hasOwnProperty("value_type")) {
            entryType = this.state.report["report_type"]["value_type"] === "financial" || this.state.report["report_type"]["value_type"] === "numeric" ? "number" : "text"
        }
        return (
            <Card>
                <Notify ref="notify"/>
                <CardHeader>
                    <div className="clearfix">
                        <CardTitle tag="h2" className="float-left">Report Details {this.state.selectedIndividual === "" ? ""
                            : "for " + this.state.user["last_name"] + ", " + this.state.user["first_name"]}</CardTitle>
                        {this.state.form !== null &&
                            <div className="float-right">
                                <Button onClick={() => {this.newEntry()}}>Submit New Entry</Button>
                            </div>
                        }
                    </div>

                </CardHeader>
                <CardBody>
                    <Alert isOpen={this.state.showSuccessAlert} toggle={() => {this.setState({showSuccessAlert: false})}}>
                        Successfully submitted new report entry!
                    </Alert>
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    >
                        <PaymentModal paymentAmount={this.state.paymentAmount}
                                      isOpen={this.state.payNow}
                                      toggle={() => {this.setState({payNow: !this.state.payNow})}}
                                      refresh={() => {this.loadReport(this.state.report["report_id"])}} />

                        <Table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    {this.props.getUserName ? <th>User</th> : null}
                                    <th>Details</th>
                                    <th>Status</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.entries.map((entry, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{this.formatDate(entry["timestamp"])}</td>
                                        {this.props.getUserName ? <td>{this.props.getUserName(entry["user_email"])}</td> : null}
                                        <td>{this.formatDescription(entry["description"])}</td>
                                        <td>{entry["status"]}</td>
                                        <td>{this.formatValue(this.state.report, entry["value"])}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td> </td>
                                {this.props.getUserName ? <td></td> : null}
                                <td> </td>
                                <td> </td>
                                <td style={{fontWeight: "bold"}}>{this.formatSummary(this.state.report, this.state.summary)}</td>
                            </tr>
                            </tbody>
                        </Table>
                        {this.state.form !== null &&
                            <ReportEntryForm isOpen={this.state.showFormEntry}
                                             toggle={() => {this.setState({showFormEntry: !this.state.showFormEntry})}}
                                             form={this.state.form}
                                             valueAnswerType={entryType}
                                             submit={(e) => {this.submitReportEntry(e)}}/>
                        }
                    </LoadingOverlay>
                </CardBody>
            </Card>

        );
    }
}

export default ReportEntriesCard;
