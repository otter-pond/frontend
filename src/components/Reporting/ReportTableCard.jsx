import React, { Component } from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle
} from "reactstrap"
import ReportingAPI from "../../api/ReportingAPI";
import ReactTable from 'react-table';
import "react-table/react-table.css";
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css'
import UsersAPI from "../../api/UsersAPI";

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class ReportTableCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportId: "",
            columns: [],
            data: []
        }

        this.reportingApi = new ReportingAPI()

        if (this.props.reportId !== null && this.props.reportId !== "") {
            this.loadReport(this.props.reportId)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.reportId !== prevProps.reportId) {
            this.loadReport(this.props.reportId)
        }
    }

    loadReport(reportId) {
        let promises = [this.reportingApi.getApplicableUsers(reportId), this.reportingApi.getReportById(reportId), this.reportingApi.getReportEntries(reportId)]
        Promise.all(promises).then((results) => {
            let users = results[0]
            let report = results[1]
            let entries = results[2]

            let isOptionSelect = report["report_type"]["value_type"] === "optionselect"
            let options = []
            if (isOptionSelect) {
                options = report["report_type"]["options"]
            }
            // Intermediate step to prevent filtering later on
            let usersDict = {}
            for (let index in users) {
                let user = users[index];
                usersDict[user["user_email"]] = user
                usersDict[user["user_email"]]["entries"] = []
            }

            let descriptionDict = {}
            for (let index in entries) {
                let entry = entries[index];
                let accessor = this.formatAccessor(entry["description"])
                descriptionDict[accessor] = entry["description"];
                let formattedEntry = {
                    accessor: accessor,
                    value: entry["value"]
                }
                usersDict[entry["user_email"]]["entries"].push(formattedEntry)
            }
            let userColumn = {
                Header: "Member",
                fixed: "left",
                columns: [
                    {Header: "Last Name", accessor: "lastName",  maxWidth: 150},
                    {Header: "First Name", accessor: "firstName", maxWidth: 150}
                ]
            }
            let columns = [userColumn];
            let data = []
            let entriesColumn = {
                Header: "Entries",
                columns: []
            }
            for (const accessor of Object.keys(descriptionDict)) {
                let column = {
                    Header: descriptionDict[accessor],
                    accessor: accessor
                }
                entriesColumn["columns"].push(column)
            }

            columns.push(entriesColumn)
            if (isOptionSelect) {
                let mainColumn = {
                    Header: "Summary",
                    columns: [],
                    fixed: "right"
                }
                for (const option of options) {
                    let column = {
                        Header: option,
                        accessor: option,
                        maxWidth: 75
                    }
                    mainColumn["columns"].push(column)
                }
                columns.push(mainColumn)
            }
            else {
                let column = {
                    Header: "Total",
                    accessor: "total",
                    fixed: "right",
                    maxWidth: 75
                }
                columns.push(column)
            }

            for (const userEmail of Object.keys(usersDict)) {
                let user = usersDict[userEmail];
                let dataUser = {}
                if (isOptionSelect) {
                    for (const option of options) {
                        dataUser[option] = 0
                    }
                } else {
                    dataUser["total"] = 0.0
                }
                for (const entry of user["entries"]) {
                    dataUser[entry["accessor"]] = entry["value"]
                    if (isOptionSelect) {
                        dataUser[entry["value"]] = dataUser[entry["value"]] + 1
                    } else {
                        dataUser["total"] = dataUser["total"] + entry["value"]
                    }
                }
                dataUser["lastName"] = user["last_name"]
                dataUser["firstName"] = user["first_name"]

                data.push(dataUser)
            }

            this.setState({
                columns: columns,
                data: data,
                reportId: reportId
            })
        }).catch(e => {
            console.log("Unable to load report table: " + e)
        })
    }

    formatAccessor(description) {
        let accessor = description.toLowerCase()
        accessor = accessor.replace(/_/g, "")
        accessor = accessor.replace(/ /g, "")
        accessor = accessor.replace(/\//g, "")
        return accessor
    }



    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h2" className="float-left">Report Table View</CardTitle>
                </CardHeader>
                <CardBody>
                    <ReactTableFixedColumns
                        data={this.state.data}
                        columns={this.state.columns}
                        showPagination={false}
                        style={{ height: 500 }}
                        className="-striped"
                    />
                </CardBody>
            </Card>

        );
    }
}

export default ReportTableCard;
