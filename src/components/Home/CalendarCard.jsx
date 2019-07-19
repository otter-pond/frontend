import React, { Component } from "react";
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
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
            events: []
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
                </CardBody>
            </Card>

        );
    }
}

export default CalendarCard;
