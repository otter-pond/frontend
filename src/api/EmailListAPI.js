import APIClient from "./APIClient";

export default class EmailListAPI extends APIClient {
    getAllLists() {
        return new Promise((resolve, reject) => {
            this.perform("get", "/email_lists/").then(lists => {
                resolve(lists)
            })
        })
    }

    updateEmailListDetails(address, list) {
        return new Promise((resolve, reject) => {
            this.perform("put", `/email_lists/${address}`, list).then(result => {
                resolve(result)
            })
        })
    }
}