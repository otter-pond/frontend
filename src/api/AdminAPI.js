import APIClient from "./APIClient";

export default class AdminAPI extends APIClient {
    launchSemester(launchConfig) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/admin/semesterLaunch`, launchConfig).then(result => {
                let exceptions = result["exceptions"]
                if (exceptions && exceptions.length > 0) {
                    console.error("Error(s) launching semester", exceptions)
                }
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }
}