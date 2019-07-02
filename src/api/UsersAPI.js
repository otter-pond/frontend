import APIClient from "./APIClient";

export default class UsersAPI extends APIClient {
    getUsers() {
        return new Promise((resolve, reject) => {
            this.perform("get", "/users/").then(users => {
                resolve(users)
            })
        })
    }
}