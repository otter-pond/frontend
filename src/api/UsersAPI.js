import APIClient from "./APIClient";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default class UsersAPI extends APIClient {
    getUsers() {
        return new Promise((resolve, reject) => {
            this.perform("get", "/users/").then(users => {
                resolve(users)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getUserByEmail(user_email) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/users/${user_email}`).then(user => {
                resolve(user)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getUserRole(user_email) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/users/${user_email}/role`).then(role => {
                resolve(role);
            }).catch(e => {
                reject(e)
            })
        })
    }

    getUserPermissions(user_email) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/users/${user_email}/permissions`).then(permissions => {
                resolve(permissions);
            }).catch(e => {
                reject(e)
            })
        })
    }

    getCurrentUser() {
        let user_email = cookies.get("user_email")
        return this.getUserByEmail(user_email)
    }

    updateUser(userEmail, user) {
        return new Promise((resolve, reject) => {
            this.perform("put", `/users/${userEmail}`, user).then(result => {
                resolve()
            }).catch(e => {
                reject(e)
            })
        })
    }

    changeUserPassword(oldPassword, newPassword) {
        let new_credentials = {
            "user_email": cookies.get("user_email"),
            "new_password": newPassword,
            "old_password": oldPassword
        };

        return new Promise((resolve, reject) => {
            this.perform("post", "/auth/changePassword", new_credentials).then(result => {
                resolve(result);
            }).catch(err => {
                reject(new Error(err));
            });
        })
    }

    deleteUser(userEmail) {
        return new Promise((resolve, reject) => {
            this.perform('delete', `/users/${userEmail}`).then(result => {
                resolve(result);
            }).catch(e => {
                reject(e)
            })
        });
    }

    createUser(user) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/users/create", user).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    enrollBuzzcard(user, gtid) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/users/${user}/buzzcard`, {"gtid": gtid}).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }
}