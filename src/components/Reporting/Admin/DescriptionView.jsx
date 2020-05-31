import React, {useState} from "react";
import {Card, CardTitle, CardBody, CardHeader, Table, Container, Row, Col} from "reactstrap";
import Select from "react-select";
import {FaTrashAlt} from "react-icons/fa";
import {formatDate, formatDescription, formatValue, summarizeEntries} from "../../../utils/ReportDisplayUtils";


const DescriptionView = (props) => {
    const [selectedDescription, setSelectedDescription] = useState(null);

    const users = props.users;
    const entries = props.entries;
    const reportType = props.reportType;
    const valueType = reportType["value_type"]

    const descriptionsMap = entries.reduce((agg, entry) => {
        if (agg.hasOwnProperty(entry["description"])) {
            agg[entry["description"]] = agg[entry["description"]] + 1
        } else {
            agg[entry["description"]] = 1
        }
        return agg;
    }, {})

    var descriptions = Object.keys(descriptionsMap)
    descriptions.sort((a, b) => {
        return a.localeCompare(b)
    });

    entries.forEach(entry => {
        let user = users.filter(a => {return a["user_email"] === entry["user_email"]})[0];
        if (user !== undefined) {
            entry["user_name"] = user["last_name"] + ", " + user["first_name"]
        }
    });

    entries.sort((a, b) => {
        return a["user_name"].localeCompare(b["user_name"])
    })

    var entriesToShow = []
    if (selectedDescription !== null) {
        entriesToShow = entries.filter(a => {return a["description"] === selectedDescription})
    }

    return <Card>
        <CardHeader>
            <CardTitle tag={"h2"} className={"float-left"}>Report Description View</CardTitle>
        </CardHeader>
        <CardBody style={{paddingLeft: "50px", paddingRight: "50px"}}>
            <Container>
                <Row>
                    <Col md={6} sm={12} style={{borderRight: "1px solid black"}}>
                        <div style={{width: "100%"}} className={"text-center"}>
                            <h3 style={{textDecoration: "underline"}}>Descriptions</h3>
                            <p>Click the trashcan to delete all entries with the given description (cannot be undone)</p>
                        </div>
                        <div style={{maxHeight: "500px", overflowY: "scroll"}}>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {descriptions.map((description, key) => {
                                        return <tr key={key} style={{cursor: "pointer"}} onClick={(e) => {
                                            if (e.target.parentElement.classList.contains("descriptionDelete")) {
                                                return;
                                            }
                                            setSelectedDescription(description)}
                                        }>
                                            <td>{formatDescription(description)}</td>
                                            <td>{descriptionsMap[description]}
                                                <FaTrashAlt style={{color: "red", cursor: "pointer", marginLeft: "10px", float: "right"}}
                                                            className={"descriptionDelete"}
                                                            onClick={() => {props.deleteEntriesWithDescription(description)}}/>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                    <Col md={6} sm={12}>

                        <div style={{width: "100%"}} className={"text-center"}>
                            <h3 style={{textDecoration: "underline"}}>Entries</h3>
                        </div>
                        {selectedDescription ===  null ?
                            <div style={{width: "100%"}} className={"text-center"}>
                                <h4>Please select a description on the left to view entries</h4>
                            </div>
                        :
                            <>
                                <p>Selected Description: <span style={{fontWeight: "bold"}}>{selectedDescription}</span></p>
                                <div style={{maxHeight: "500px", overflowY: "scroll"}}>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Timestamp</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entriesToShow.map((entry, key) => {
                                                return <tr key={key}>
                                                    <td>{entry["user_name"]}</td>
                                                    <td>{formatDate(entry["timestamp"])}</td>
                                                    <td>{formatValue(valueType, entry["value"])}
                                                        <FaTrashAlt style={{color: "red", cursor: "pointer", marginLeft: "10px", float: "right"}}
                                                                    onClick={() => {props.deleteReportEntry(entry["user_email"], entry["entry_id"])}}/>
                                                    </td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                                <div className={"float-right"} style={{fontWeight: "bold"}}>
                                    {summarizeEntries(entriesToShow, valueType)}
                                </div>
                            </>
                        }
                    </Col>
                </Row>
            </Container>
        </CardBody>
    </Card>
}

export default DescriptionView