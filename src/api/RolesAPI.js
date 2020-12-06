import APIClient from "./APIClient";

export default class RolesAPI extends APIClient {
    getRoles() {
        return new Promise((resolve, reject) => {
            this.perform("get", "/roles/").then(roles => {
                resolve(roles)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getRoleById(role_id) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/roles/${role_id}`).then(role => {
                resolve(role)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getUsersWithRole(role_id) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/roles/${role_id}/users`).then(users => {
                resolve(users)
            }).catch(e => {
                reject(e)
            })
        })
    }

    setUserRole(role_id, user_email) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/roles/${role_id}/users`, {"user_email": user_email}).then((result) => {
                if (result.error === "Success")
                    resolve();
                else
                    reject();
            }).catch(e => {
                reject(e)
            })
        })
    }
}