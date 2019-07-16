import APIClient from "./APIClient";

export default class CalendarAPI extends APIClient {
    get_configuration() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/calendar/config`).then((config) => {
                resolve(config)
            })
        })
    }
}