import config from "variables/config"
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
                    resolve()
                }
            })
        })
    }

    checkAuthentication() {
        return new Promise((resolve, reject) => {
            if (!this.accessToken)
                reject()
            this.perform("get","/auth/checkLoginStatus").then(userInfo => {
                if (userInfo && userInfo["user_name"]) {
                    cookies.set("user_name", userInfo["user_name"])
                    resolve()
                } else {
                    reject()
                }
            }).catch(() => {
                reject()
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