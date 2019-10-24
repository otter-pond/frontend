import React, { Component } from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle, Table,
} from "reactstrap"
import ReportingAPI from "../../api/ReportingAPI";
import UsersAPI from "../../api/UsersAPI";
import LoadingOverlay from "react-loading-overlay";

class ReportEntriesCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            report: {},
            entries: [],
            summary: null,
            selectedIndividual: "",
            user: null,
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
        let promises = [reportPromise, this.reportingApi.getReportById(reportId)]
        if (selectedIndividual !== "") {
            promises.push(this.usersApi.getUserByEmail(selectedIndividual))
        }
        Promise.all(promises).then(results => {
            let report = results[1];
            let entries = results[0];
            let user = null;
            if (selectedIndividual !== "") {
                user = results[2]
            }
            if (entries == null || entries.length === 0) {
                this.setState({
                    report: report,
                    entries: [],
                    summary: null,
                    loading: false,
                    user: user,
                    selectedIndividual: selectedIndividual,
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
                loading: false
            })

        }).catch(e =>{
            console.log("Unable to load report: " + e)
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

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h2" className="float-left">Report Details {this.state.selectedIndividual === "" ? ""
                        : "for " + this.state.user["last_name"] + ", " + this.state.user["first_name"]}</CardTitle>
                </CardHeader>
                <CardBody>
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    >
                        <Table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    {this.props.getUserName ? <th>User</th> : null}
                                    <th>Details</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.entries.map((entry, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{this.formatDate(entry["timestamp"])}</td>
                                        {this.props.getUserName ? <td>{this.props.getUserName(entry["user_email"])}</td> : null}
                                        <td>{entry["description"]}</td>
                                        <td>{this.formatValue(this.state.report, entry["value"])}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td> </td>
                                {this.props.getUserName ? <td></td> : null}
                                <td> </td>
                                <td style={{fontWeight: "bold"}}>{this.formatSummary(this.state.report, this.state.summary)}</td>
                            </tr>
                            </tbody>
                        </Table>
                    </LoadingOverlay>
                </CardBody>
            </Card>

        );
    }
}

export default ReportEntriesCard;
