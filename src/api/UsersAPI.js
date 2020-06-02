import APIClient from "./APIClient";
import Cookies from "universal-cookie";
import { tsThisType } from "@babel/types";

const cookies = new Cookies();

export default class UsersAPI extends APIClient {
    getUsers() {
        return new Promise((resolve, reject) => {
            this.perform("get", "/users/").then(users => {
                resolve(users)
            })
        })
    }

    getUserByEmail(user_email) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/users/${user_email}`).then(user => {
                resolve(user)
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

    getCurrentUser() {
        let user_email = cookies.get("user_email")
        return this.getUserByEmail(user_email)
    }

    updateUser(userEmail, user) {
        return new Promise((resolve, reject) => {
            this.perform("put", `/users/${userEmail}`, user).then(result => {
                resolve()
            })
        })
    }

    deleteUser(userEmail) {
        return new Promise((resolve, reject) => {
            this.perform('delete', `/users/${userEmail}`).then(result => {
                resolve(result);
            }).catch(err => {
                reject(new Error(err));
            });
        });
    }
}