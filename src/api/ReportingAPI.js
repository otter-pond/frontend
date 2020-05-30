import APIClient from "./APIClient";
import Cookies from "universal-cookie";

export default class ReportingAPI extends APIClient {
    getReports() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/`).then(reports => {
                resolve(reports)
            })
        })
    }

    getAdminReports() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/adminReports`).then(reports => {
                resolve(reports)
            })
        })
    }

    getSemesters() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/semesters/`).then(reports => {
                resolve(reports)
            })
        })
    }

    createSemester(semester) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/semesters/create`, semester).then(result => {
                resolve(result)
            })
        })
    }

    updateSemester(semesterId, semester) {
        return new Promise((resolve, reject) => {
            this.perform("put", `/reporting/semesters/${semesterId}`, semester).then(result => {
                resolve(result)
            })
        })
    }

    createReportType(reportType) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/types/create`, reportType).then(result => {
                resolve(result)
            })
        })
    }

    updateReportType(reportId, reportType) {
        return new Promise((resolve, reject) => {
            this.perform("put", `/reporting/types/${reportId}`, reportType).then(result => {
                resolve(result)
            })
        })
    }

    createReport(report) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/reporting/create", report).then(result => {
                resolve(result);
            })
        })
    }

    getReportTypes() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/types/`).then(reports => {
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

    getReportFormById(reportId) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${reportId}/form`).then(report => {
                resolve(report)
            })
        })
    }

    getReportTypeById(reportTypeId) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/types/${reportTypeId}`).then(report => {
                resolve(report)
            })
        })
    }

    getUserReportEntries(report_id, other_user = "") {
        let cookies = new Cookies();
        let username = cookies.get("user_email", {path: "/"})
        if (other_user !== "") {
            username = other_user
        }
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${report_id}/entries/${username}`).then(entries => {
                resolve(entries);
            })
        })
    }

    getReportEntries(report_id) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${report_id}/entries`).then(entries => {
                resolve(entries);
            })
        })
    }

    addDescription(report_id, description) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/${report_id}/presetDescription`, {'description': description}).then(result => {
                resolve(result);
            })
        })
    }

    createReportEntry(report_id, entry, existing = false) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/${report_id}/entries?checkExisting=${existing}`, entry).then(result => {
                resolve(result);
            })
        })
    }


    checkReportPermissions(report_id) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${report_id}/checkPermissions`).then(result => {
                resolve(result["can_manage"])
            })
        })
    }


    getApplicableUsers(report_id) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${report_id}/applicableUsers`).then(users => {
                resolve(users)
            })
        })
    }

    submitReportEntry(report_id, entry) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/${report_id}/form/submit`, entry).then(result => {
                resolve(result);
            })
        })
    }
}