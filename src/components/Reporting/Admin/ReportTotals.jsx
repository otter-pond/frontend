import React from "react";
import {Card, CardTitle, CardBody, CardHeader, Table} from "reactstrap";
import {formatValue} from "../../../utils/ReportDisplayUtils";


const ReportTotals = (props) => {
    const users = props.users;
    const entries = props.entries;
    const reportType = props.reportType;
    const roles = props.roles
    const valueType = reportType["value_type"];
    const rolesMap = roles.reduce((agg, role) => {
        agg[role["role_id"]] = role["role_description"]
        return agg
    }, {})
    var usersTotalMap = users.reduce((agg, user) => {
        agg[user["user_email"]] = {
            name: user["last_name"] + ", " + user["first_name"],
            role: rolesMap[user["role_id"]],
            value: valueType === "optionselect" ?
                reportType["options"].reduce((agg, type) => {
                    agg[type] = 0
                    return agg
                }, {})
             : 0
        };
        return agg
    }, {});
    entries.forEach(entry => {
        let userEmail = entry["user_email"]
        if (!usersTotalMap.hasOwnProperty(userEmail)) {
            return;
        }
        let value = entry["value"]
        if (valueType === "optionselect") {
            usersTotalMap[userEmail].value[value] = usersTotalMap[userEmail].value[value] + 1
        } else {
            usersTotalMap[userEmail].value = usersTotalMap[userEmail].value + parseFloat(value)
        }
    });
    const totals = Object.keys(usersTotalMap).reduce((agg, userEmail) => {
        var row = {
            "Name" : usersTotalMap[userEmail]["name"],
            "Role" : usersTotalMap[userEmail]["role"]
        }
        if (valueType === "optionselect") {
            row = {
                ...row,
                ...usersTotalMap[userEmail].value
            }
        } else {
            row["Value"] = usersTotalMap[userEmail].value
        }
        agg.push(row);
        return agg;
    }, []);
    if (totals.length === 0) {
        return <p>This report has no entries</p>
    }
    totals.sort((a, b) => {
        return a["Name"].localeCompare(b["Name"])
    })
    return <Card>
        <CardHeader>
            <CardTitle tag={"h2"} className={"float-left"}>Report Totals View</CardTitle>
        </CardHeader>
        <CardBody style={{paddingLeft: "50px", paddingRight: "50px"}}>
            <Table>
                <thead>
                    <tr>
                        {Object.keys(totals[0]).map((name, key) => {
                            return <th key={key}>{name}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {totals.map((row, key) => {
                        return <tr key={key}>
                            {Object.keys(row).map((name, index) => {
                                if (index > 0) {
                                    return <td>{formatValue(valueType,row[name])}</td>
                                }
                                return <td>{row[name]}</td>
                            })}
                        </tr>
                    })}
                </tbody>
            </Table>
        </CardBody>
    </Card>
}

export default ReportTotals