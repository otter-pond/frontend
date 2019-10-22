import React, { Component } from "react";
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Button, Input
} from "reactstrap"

import CalendarAPI from "../../api/CalendarAPI";
import CalendarEventFetcher from "../../api/CalendarEventFetcher";

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

class CalendarCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            link: ""
        };

        this.calendarClient = new CalendarAPI();
        this.eventFetcher = new CalendarEventFetcher();

        this.calendarClient.get_configuration().then(config => {
            this.eventFetcher.load_events(config["api_key"], config["calendar_url"]).then(events => {
                this.setState({
                    events: events
                })
            })
        }).catch(e => {
            console.log("Unable to load calendar: " + e)
        })
    }

    generateLink(){
        this.calendarClient.generate_link().then(link => {
            this.setState({
                link: link
            })
        })
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h2" className="float-left">Calendar</CardTitle>
                </CardHeader>
                <CardBody>
                    <div style={{height: "500px", paddingBottom: "100px"}}>
                        <Calendar
                            popup
                            localizer={localizer}
                            events={this.state.events}
                            startAccessor="start"
                            endAccessor="end"
                            height="300px"
                            views={['month']}
                            onRangeChange={(e) => {console.log(e)}}
                        />
                    </div>
                    <Row>
                        <Col xs={2}>
                            <Button onClick={() => {this.generateLink()}}>Generate iCal Link</Button>
                        </Col>
                        <Col xs={10}>
                            {this.state.link !== "" &&
                            <Input type="text" readonly value={this.state.link}/>
                            }
                        </Col>
                    </Row>
                </CardBody>
            </Card>

        );
    }
}

export default CalendarCard;
