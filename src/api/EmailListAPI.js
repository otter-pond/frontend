import APIClient from "./APIClient";

export default class EmailListAPI extends APIClient {
    getAllLists(onlyJoinable = false) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/email_lists/?onlyJoinable=${onlyJoinable}`).then(lists => {
                resolve(lists)
            }).catch(e => {
                reject(e)
            })
        })
    }

    updateEmailListDetails(address, list) {
        return new Promise((resolve, reject) => {
            this.perform("put", `/email_lists/${address}`, list).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getAllUsersFromList(address) {
        return new Promise((resolve, reject) => {
            this.perform("get", `email_lists/${address}/subscribers`).then(users => {
                resolve(users)
            }).catch(e => {
                reject(e)
            })
        })
    }

    removeUserFromList(address, user) {
        return new Promise((resolve, reject) => {
            this.perform("delete", `email_lists/${address}/subscribers/${user}`).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    addUserToList(address, user) {
        return new Promise((resolve, reject) => {
            this.perform("post", `email_lists/${address}/subscribe`, {"user_email":user}).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    checkVerification(address) {
        return new Promise((resolve, reject) => {
            this.perform("post", `email_lists/checkVerification`, {"user_email": address}).then(result => {
                resolve(result["verified"])
            }).catch(e => {
                reject(e)
            })
        })
    }

    requestVerification(address) {
        return new Promise((resolve, reject) => {
            this.perform("post", `email_lists/requestVerification`, {"user_email": address}).then(result => {
                resolve()
            }).catch(e => {
                reject(e)
            })
        })
    }

    getAllRolePermissions(address) {
        return new Promise((resolve, reject) => {
            this.perform("get", `email_lists/${address}/rolePermissions/`).then(permissions => {
                resolve(permissions)
            }).catch(e => {
                reject(e)
            })
        })
    }

    setRolePermission(permission, roleId, address) {
        return new Promise((resolve, reject) => {
            this.perform("post", `email_lists/${address}/rolePermissions/${roleId}`, permission).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getUserSubscriptions(user_email) {
        return new Promise((resolve, reject) => {
            this.perform("get", `email_lists/subscriptions/${user_email}`).then(subscriptions => {
                resolve(subscriptions)
            }).catch(e => {
                reject(e)
            })
        })
    }
}