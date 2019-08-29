import React, { Component } from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle, Table,
} from "reactstrap"
import ReportingAPI from "../../api/ReportingAPI";

class ReportEntriesCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            report: {},
            entries: [],
            summary: null
        }

        this.reportingApi = new ReportingAPI();

        if (this.props.reportId != null && this.props.reportId != "") {
            this.loadReport(this.props.reportId)
        }
    }

    loadReport(reportId) {
        let promises = [this.reportingApi.getUserReportEntries(reportId), this.reportingApi.getReportById(reportId)]
        Promise.all(promises).then(results => {
            let report = results[1];
            let entries = results[0];
            if (entries == null || entries.length === 0) {
                this.setState({
                    report: report,
                    entries: []
                });
                return;
            }
            var summary;
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
                    total += entry["value"]
                });
                summary = total
            }
            this.setState({
                entries: entries,
                report: report,
                summary: summary
            })

        }).catch(e =>{
            console.log("Unable to load report: " + e)
        })
    }

    componentDidUpdate(prevProps){
        if (this.props.reportId !== prevProps.reportId) {
            this.loadReport(this.props.reportId)
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
                    <CardTitle tag="h2" className="float-left">Report Details</CardTitle>
                </CardHeader>
                <CardBody>
                    <Table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Details</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.entries.map((entry, index) => {
                            return(
                                <tr key={index}>
                                    <td>{this.formatDate(entry["timestamp"])}</td>
                                    <td>{entry["description"]}</td>
                                    <td>{this.formatValue(this.state.report, entry["value"])}</td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td> </td>
                            <td> </td>
                            <td style={{fontWeight: "bold"}}>{this.formatSummary(this.state.report, this.state.summary)}</td>
                        </tr>
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

        );
    }
}

export default ReportEntriesCard;
