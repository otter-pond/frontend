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

    getAllUsersFromList(address) {
        return new Promise((resolve, reject) => {
            this.perform("get", `email_lists/${address}/subscribers`).then(users => {
                resolve(users)
            })
        })
    }

    removeUserFromList(address, user) {
        return new Promise((resolve, reject) => {
            this.perform("delete", `email_lists/${address}/subscribers/${user}`).then(result => {
                resolve(result)
            })
        })
    }

    addUserToList(address, user) {
        return new Promise((resolve, reject) => {
            this.perform("post", `email_lists/${address}/subscribe`, {"user_email":user}).then(result => {
                resolve(result)
            })
        })
    }
}