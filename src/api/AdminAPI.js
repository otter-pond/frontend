import APIClient from "./APIClient";

export default class AdminAPI extends APIClient {
    launchSemester(launchConfig) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/admin/semesterLaunch`, launchConfig).then(result => {
                resolve(result)
            })
        })
    }
}