import React, {useState} from "react";
import {Card, CardTitle, CardBody, CardHeader, Table} from "reactstrap";
import Select from "react-select";

const formatDate = (date) => {
    try{
        return new Date(date).toLocaleDateString();
    } catch(e) {
        console.log("Unable to format date")
        return "Invalid Date"
    }
}

const formatValue = (valueType, value) => {
    if (valueType != null) {
        if (valueType === "financial") {
            let fixed = value.toFixed(2);
            if (value < 0) {
                return "-$" + Math.abs(fixed)
            }
            return "$" + fixed;
        }
    }
    return value;
}

const formatDescription = (description) => {
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
        if (valueType === "optionselect") {
            var summaryObj = {}
            individualEntries.forEach(entry => {
                if (summaryObj.hasOwnProperty(entry["value"])) {
                    summaryObj[entry["value"]] = summaryObj[entry["value"]] + 1
                } else {
                    summaryObj[entry["value"]] = 1;
                }
            })
            summary = <span>
                {Object.keys(summaryObj).map((name, key) => {
                    return <span key={key}>{name}: {summaryObj[name]}<br /></span>
                })}
            </span>
        } else {
            var total = 0;
            individualEntries.forEach(entry => {
                total += parseFloat(entry["value"]);
            });
            if (valueType === "financial") {
                total = total.toFixed(2);
                if (total > 0) {
                    summary = <span>Total: ${total}</span>
                } else {
                    summary = <span>Total: -${Math.abs(total)}</span>
                }
            } else {
                summary = <span>Total: {total}</span>
            }
        }
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
                            <td>{formatValue(valueType, entry["value"])}</td>
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