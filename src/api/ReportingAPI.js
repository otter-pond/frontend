import APIClient from "./APIClient";
import Cookies from "universal-cookie";

export default class ReportingAPI extends APIClient {
    getReports() {
        return new Promise((resolve, reject) => {
            this.perform("get", "/reporting/").then(reports => {
                resolve(reports)
            })
        })
    }

    getReportById(reportId) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${reportId}`).then(report => {
                resolve(report)
            })
        })
    }

    getUserReportEntries(report_id) {
        let cookies = new Cookies();
        let username = cookies.get("username", {path: "/"})
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${report_id}/entries/${username}`).then(entries => {
                resolve(entries);
            })
        })
    }

    getReportEntries(report_id) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${report_id}/entries/`).then(entries => {
                resolve(entries);
            })
        })
    }

}