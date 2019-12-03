import APIClient from "./APIClient";

export default class EmailListAPI extends APIClient {
    getAllLists(onlyJoinable = false) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/email_lists/?onlyJoinable=${onlyJoinable}`).then(lists => {
                resolve(lists)
            })
        })
    }

    updateEmailListDetails(address, list) {
        return new Promise((resolve, reject) => {
            this.perform("put", `/email_lists/${address}`, list).then(result => {
                resolve(result)
            })
        })
    }

    getAllUsersFromList(address) {
        return new Promise((resolve, reject) => {
            this.perform("get", `email_lists/${address}/subscribers`).then(users => {
                resolve(users)
            })
        })
    }

    removeUserFromList(address, user) {
        return new Promise((resolve, reject) => {
            this.perform("delete", `email_lists/${address}/subscribers/${user}`).then(result => {
                resolve(result)
            })
        })
    }

    addUserToList(address, user) {
        return new Promise((resolve, reject) => {
            this.perform("post", `email_lists/${address}/subscribe`, {"user_email":user}).then(result => {
                resolve(result)
            })
        })
    }

    checkVerification(address) {
        return new Promise((resolve, reject) => {
            this.perform("post", `email_lists/checkVerification`, {"user_email": address}).then(result => {
                resolve(result["verified"])
            })
        })
    }

    requestVerification(address) {
        return new Promise((resolve, reject) => {
            this.perform("post", `email_lists/requestVerification`, {"user_email": address}).then(result => {
                resolve()
            })
        })
    }

    getAllRolePermissions(address) {
        return new Promise((resolve, reject) => {
            this.perform("get", `email_lists/${address}/rolePermissions/`).then(permissions => {
                resolve(permissions)
            })
        })
    }

    setRolePermission(permission, roleId, address) {
        return new Promise((resolve, reject) => {
            this.perform("post", `email_lists/${address}/rolePermissions/${roleId}`, permission).then(result => {
                resolve(result)
            })
        })
    }

    getUserSubscriptions(user_email) {
        return new Promise((resolve, reject) => {
            this.perform("get", `email_lists/subscriptions/${user_email}`).then(subscriptions => {
                resolve(subscriptions)
            })
        })
    }
}