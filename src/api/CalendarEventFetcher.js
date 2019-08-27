
import axios from 'axios';

const client = axios.create({
    baseURL: "https://www.googleapis.com/calendar/v3",
    json: true
});

class CalendarEventFetcher {

    load_events (api_key, calendar_url) {
        return new Promise((resolve, reject) => {
            let url = `/calendars/${calendar_url}/events?key=${api_key}`;

            client({
                method: "get",
                url: url
            }).then(resp => {
                let results = resp.data ? resp.data : [];
                let events = [];
                results.items.map((event) => {
                    if (event.status !== "cancelled") {
                        events.push({
                            start: event.start.date || event.start.dateTime,
                            end: event.end.date || event.end.dateTime,
                            title: event.summary,
                        })
                    }

                });
                resolve(events);
            })
        })

    }
}

export default CalendarEventFetcher;