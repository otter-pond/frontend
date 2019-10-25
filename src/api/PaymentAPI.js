import APIClient from "./APIClient";

export default class CalendarAPI extends APIClient {
    getAccountStatus() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/payment/account`).then((status) => {
                resolve(status)
            })
        })
    }

    deleteAccount() {
        return new Promise((resolve, reject) => {
            this.perform("delete", `/payment/account`).then((result) => {
                resolve(result)
            })
        })
    }

    enrollBankAccount(token) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/payment/enroll", {"stripeToken": token}).then((result) => {
                resolve(result)
            })
        })
    }

    verifyAccount(deposit1, deposit2) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/payment/verify", {"firstDeposit": deposit1, "secondDeposit": deposit2}).then(result => {
                resolve(result)
            })
        })
    }
}