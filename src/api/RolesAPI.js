import APIClient from "./APIClient";

export default class RolesAPI extends APIClient {
    getRoles() {
        return new Promise((resolve, reject) => {
            this.perform("get", "/roles/").then(roles => {
                resolve(roles)
            })
        })
    }
}