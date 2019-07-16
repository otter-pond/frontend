import APIClient from "./APIClient";

export default class UsersAPI extends APIClient {
    getUsers() {
        return new Promise((resolve, reject) => {
            this.perform("get", "/users/").then(users => {
                resolve(users)
            })
        })
    }

    getUserRole(user_email) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/users/${user_email}/role`).then(role => {
                resolve(role);
            })
        })
    }

    getUserPermissions(user_email) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/users/${user_email}/permissions`).then(permissions => {
                resolve(permissions);
            })
        })
    }
}