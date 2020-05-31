import React, {useState} from "react";
import {Card, CardTitle, CardBody, CardHeader, Table} from "reactstrap";
import Select from "react-select";
import {FaTrashAlt} from "react-icons/fa";
import {formatDate, formatDescription, formatValue, summarizeEntries} from "../../../utils/ReportDisplayUtils";

const IndividualView = (props) => {
    const [selectedUser, setSelectedUser] = useState(null);

    const users = props.users;
    const entries = props.entries;
    const reportType = props.reportType;
    const valueType = reportType["value_type"]

    var individualEntries = [];
    var summary = "";

    const userOptions = users.map(user => {
        return {
            value: user["user_email"],
            label: user["last_name"] + ", " + user["first_name"]
        }
    });

    userOptions.sort((a, b) => {
        return a["label"].localeCompare(b["label"])
    });

    if (selectedUser !== null) {
        individualEntries = entries.filter(entry => {
            return entry["user_email"] === selectedUser;
        });
        summary = summarizeEntries(individualEntries, valueType)
    }

    return <Card>
        <CardHeader>
            <CardTitle tag={"h2"} className={"float-left"}>Report Individual View</CardTitle>
        </CardHeader>
        <CardBody style={{paddingLeft: "50px", paddingRight: "50px"}}>
            <div className={"clearfix"}>
                <div style={{marginTop: "5px", marginRight: "20px"}} className={"float-left"}>
                    <h4>Select Individual To View:</h4>
                </div>
                <div style={{width: "300px"}} className={"float-left"}>
                    <Select
                        //value={this.state.selectedReportId}
                        onChange={(e) => {setSelectedUser(e.value)}}
                        options={userOptions}
                    />
                </div>
            </div>

            {individualEntries.length === 0 ?
                <p>There are no entries to show</p>
            :
                <Table>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {individualEntries.map((entry, key) => {
                        return <tr key={key}>
                            <td>{formatDate(entry["timestamp"])}</td>
                            <td>{formatDescription(entry["description"])}</td>
                            <td>{entry["status"]}</td>
                            <td>{formatValue(valueType, entry["value"])}
                                <FaTrashAlt style={{color: "red", cursor: "pointer", marginLeft: "10px", float: "right"}}
                                        onClick={() => {props.deleteReportEntry(entry["user_email"], entry["entry_id"])}}/>
                            </td>
                        </tr>
                    })}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{fontWeight: "bold"}}>{summary}</td>
                    </tr>
                    </tbody>
                </Table>
            }

        </CardBody>
    </Card>
}

export default IndividualView