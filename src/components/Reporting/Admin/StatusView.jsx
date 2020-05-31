import React, {useState} from "react";
import {Card, CardTitle, CardBody, CardHeader, Table, Button} from "reactstrap";
import Select from "react-select";
import {FaTrashAlt} from "react-icons/fa";
import {formatDate, formatDescription, formatValue, summarizeEntries} from "../../../utils/ReportDisplayUtils";


const StatusView = (props) => {
    const [selectedViewStatus, setSelectedViewStatus] = useState(null);
    const [selectedChangeStatus, setSelectedChangeStatus] = useState(null);
    const [selectedBulkEntries, setSelectedBulkEntries] = useState(null);

    const users = props.users;
    const entries = props.entries;
    const reportType = props.reportType;
    const valueType = reportType["value_type"]

    const statusOptions = reportType["status_options"];
    const statuses = statusOptions.statuses;
    var statusSelectOptions = []
    const hasStatuses = statuses !== undefined && statuses.length > 0
    if (hasStatuses) {
        statusSelectOptions= [{ value: "", label: "No Status"}, ...statuses.map(status => {
            return {
                value: status,
                label: status
            }
        })];
    }

    entries.forEach(entry => {
        let user = users.filter(a => {return a["user_email"] === entry["user_email"]})[0];
        if (user !== undefined) {
            entry["user_name"] = user["last_name"] + ", " + user["first_name"]
        }
    })

    var entriesToShow = []
    if (selectedViewStatus !== null) {
        entriesToShow = entries.filter(entry => {
            if (selectedViewStatus === "") {
                return !entry.hasOwnProperty("status") || entry["status"] === "" || entry["status"] === null
            }
            return entry["status"] === selectedViewStatus
        });
    }

    entriesToShow.forEach(entry => {
        let user = users.filter(a => {return a["user_email"] === entry["user_email"]})[0];
        if (user !== undefined) {
            entry["user_name"] = user["last_name"] + ", " + user["first_name"]
        }
    })

    entriesToShow.sort((a, b) => {
        return new Date(a["timestamp"]) - new Date(b["timestamp"])
    });

    const getOptionButton = (entry) => {
        if (selectedBulkEntries === null) {
            if (selectedChangeStatus !== null) {
                return <Button size={"sm"}
                               color={"secondary"}
                               onClick={() => {props.changeEntryStatus(entry["entry_id"], selectedChangeStatus)}}
                >Change to {selectedChangeStatus}</Button>
            }
        } else {
            if (selectedBulkEntries.includes(entry["entry_id"])) {
                return <Button size={"sm"}
                               color={"secondary"}
                               onClick={() => {setSelectedBulkEntries(selectedBulkEntries.filter(a => {return a !== entry["entry_id"]}))}}
                >Deselect Entry</Button>
            } else {
                return <Button size={"sm"}
                               color={"secondary"}
                               onClick={() => {
                                   setSelectedBulkEntries([...selectedBulkEntries, entry["entry_id"]])}
                               }
                >Select Entry</Button>
            }
        }
    };


    return <Card>
        <CardHeader>
            <CardTitle tag={"h2"} className={"float-left"}>Report Status View</CardTitle>
        </CardHeader>
        <CardBody style={{paddingLeft: "50px", paddingRight: "50px"}}>
            {hasStatuses ?
                <>
                    <div className={"clearfix"}  style={{width: "100%"}}>
                        <div style={{marginTop: "5px", marginRight: "20px"}} className={"float-left"}>
                            <h4>Select Status To View:</h4>
                        </div>
                        <div style={{width: "300px"}} className={"float-left"}>
                            <Select
                                onChange={(e) => {setSelectedViewStatus(e.value)}}
                                options={statusSelectOptions}
                            />
                        </div>
                    </div>
                    {selectedViewStatus !== null &&
                    <div className={"clearfix"} style={{width: "100%"}}>
                        <div style={{marginTop: "5px", marginRight: "20px"}} className={"float-left"}>
                            <h4>Select Status To Change To:</h4>
                        </div>
                        <div style={{width: "300px"}} className={"float-left"}>
                            <Select
                                onChange={(e) => {
                                    setSelectedChangeStatus(e.value)
                                }}
                                options={statusSelectOptions}
                            />
                        </div>
                        <div className={"float-left"} style={{marginLeft: "10px"}}>
                            {selectedChangeStatus !== null && (selectedBulkEntries === null ?
                                <Button size={"sm"}
                                        color={"secondary"}
                                        onClick={() => {setSelectedBulkEntries([])}}
                                >Enable Bulk Status Change</Button>
                            :
                                <>
                                    <Button size={"sm"}
                                            color={"danger"}
                                            onClick={() => {setSelectedBulkEntries(null)}}
                                    >Cancel Bulk Status Change</Button>
                                    <Button size={"sm"}
                                            color={"secondary"}
                                            onClick={() => {props.changeEntryStatusBulk(selectedBulkEntries, selectedChangeStatus); setSelectedBulkEntries(null)}}
                                    >Save Bulk Status Change</Button>
                                </>
                            )}
                        </div>
                    </div>
                    }
                {selectedViewStatus !== null ?
                    <div style={{maxHeight: "500px", overflowY: "scroll"}}>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Timestamp</th>
                                    <th>Value</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entriesToShow.map((entry, key) => {
                                    return <tr key={key}>
                                        <td>{entry["user_name"]}</td>
                                        <td>{formatDescription(entry["description"])}</td>
                                        <td>{formatDate(entry["timestamp"])}</td>
                                        <td>{formatValue(valueType, entry["value"])}</td>
                                        <td>{getOptionButton(entry)}</td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </div>
                :
                    <p>Select a status to view entries</p>
                }
                </>
            :
                <p>This report type does not have statuses enabled.</p>
            }

        </CardBody>
    </Card>
}

export default StatusView