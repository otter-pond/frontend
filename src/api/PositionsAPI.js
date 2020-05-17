import APIClient from "./APIClient";

export default class PositionsAPI extends APIClient {
    getAllPositions() {
        return new Promise((resolve, reject) => {
            this.perform("get", "/positions/").then(positions => {
                resolve(positions)
            })
        })
    }

    getAllPermissions() {
        return new Promise((resolve, reject) => {
            this.perform("get", "/config/permissions").then(permissions => {
                resolve(permissions)
            })
        })
    }

    getUsersForPosition(positionId) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/positions/${positionId}/users/`).then(users => {
                resolve(users)
            })
        })
    }

    update_position(positionId, position){
        return new Promise((resolve, reject) => {
            this.perform("put", `/positions/${positionId}`, position).then(result => {
                resolve(result)
            })
        })
    }

    delete_position(positionId) {
        return new Promise((resolve, reject) => {
            this.perform("delete", `/positions/${positionId}`).then(result => {
                resolve(result)
            })
        })
    }

    add_holder(positionId, user_email){
        return new Promise((resolve, reject) => {
            this.perform("post", `/positions/${positionId}/users/${user_email}`).then(result => {
                resolve(result)
            })
        })
    }

    remove_holder(positionId, user_email){
        return new Promise((resolve, reject) => {
            this.perform("delete", `/positions/${positionId}/users/${user_email}`).then(result => {
                resolve(result)
            })
        })
    }

    createPosition(position) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/positions/create", position).then(result => {
                resolve(result)
            })
        })
    }
}