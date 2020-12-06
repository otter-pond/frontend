import config from "../variables/config"
import Cookies from 'universal-cookie';

import axios from 'axios';

const BASE_URI = config.apiGateway;

const cookies = new Cookies();

const client = axios.create({
    baseURL: BASE_URI,
    json: true
});

class APIClient {
    constructor() {
        this.accessToken = cookies.get("accessToken");
        this.baseUri = BASE_URI
    }

    login(username, password) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/auth/login", {
                user_email: username,
                password: password
            }).then(token => {
                if (token === "Invalid")
                    reject()
                else {
                    this.accessToken = token
                    cookies.set("accessToken", token, { path: '/' })
                    cookies.set("user_email", username, {path: '/'})
                    resolve()
                }
            }).catch(e => {
                reject(e)
            })
        })
    }

    checkAuthentication() {
        return new Promise((resolve, reject) => {
            if (!this.accessToken)
                reject()
            this.perform("get","/auth/checkLoginStatus").then(userInfo => {
                // reject()
                if (userInfo && userInfo["user_name"]) {
                    cookies.set("user_email", userInfo["user_name"])
                    resolve()
                } else {
                    reject()
                }
            }).catch((e) => {
                reject(e)
            })
        })
    }

    requestResetPassword(email) {
        return new Promise((resolve, reject) => {
            // TODO: Fill this in with actual API route with real data and real response handling
            this.perform("post", "/auth/requestResetPassword", {
                user_email: email
            }).then( () => {
                resolve()
            }).catch( (e) => {
                reject(e)
            })
        })
    }

    resetPassword(email, newPassword, resetToken) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/auth/resetPassword", {
                user_email: email,
                token: resetToken,
                password: newPassword
            }).then( () => {
                resolve()
            }).catch( (e) => {
                reject(e)
            })
        })
    }

    async perform (method, resource, data) {
        return client({
            method,
            url: resource,
            data,
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        }).then(resp => {
            return resp.data ? resp.data : [];
        })
    }
}

export default APIClient;