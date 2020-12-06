import APIClient from "./APIClient";

export default class CalendarAPI extends APIClient {
    get_configuration() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/calendar/config`).then((config) => {
                resolve(config)
            }).catch(e => {
                reject(e)
            })
        })
    }

    generate_link() {
        return new Promise((resolve, reject) => {
            this.perform("get", "/calendar/generateLink").then(result => {
                resolve(result["link"])
            }).catch(e => {
                reject(e)
            })
        })
    }
}