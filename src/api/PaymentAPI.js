import APIClient from "./APIClient";

export default class CalendarAPI extends APIClient {
    getAccountStatus() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/payment/accountStatus`).then((status) => {
                resolve(status)
            })
        })
    }
}