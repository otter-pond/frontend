import APIClient from "./APIClient";

export default class ConfigAPI extends APIClient {
    getSetting(settingName) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/config/settings`).then(results => {
                let setting = results.filter(a => {return a["identifier"] === settingName})
                if (setting.length > 0)
                    resolve(setting[0]);
                else
                    resolve(null)
            })
        })
    }

    saveSetting(setting) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/config/settings`, setting).then(result => {
                resolve()
            })
        })
    }
}