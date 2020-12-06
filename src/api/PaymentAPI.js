import APIClient from "./APIClient";

export default class CalendarAPI extends APIClient {
    getAccountStatus() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/payment/account`).then((status) => {
                resolve(status)
            }).catch(e => {
                reject(e)
            })
        })
    }

    deleteAccount() {
        return new Promise((resolve, reject) => {
            this.perform("delete", `/payment/account`).then((result) => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    enrollBankAccount(token) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/payment/enroll", {"stripeToken": token}).then((result) => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    verifyAccount(deposit1, deposit2) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/payment/verify", {"firstDeposit": deposit1, "secondDeposit": deposit2}).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    charge(amount) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/payment/charge", {"amount": amount}).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    prepareCharge(amount) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/payment/prepareCharge", {"amount": amount}).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    executeCharge(report_entry_id) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/payment/executeCharge", {"report_entry_id": report_entry_id}).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }
}