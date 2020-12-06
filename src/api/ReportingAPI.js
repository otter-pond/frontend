import APIClient from "./APIClient";
import Cookies from "universal-cookie";

export default class ReportingAPI extends APIClient {
    getReports() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/`).then(reports => {
                resolve(reports)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getAdminReports() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/adminReports`).then(reports => {
                resolve(reports)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getSemesters() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/semesters/`).then(reports => {
                resolve(reports)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getSemesterById(semesterId) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/semesters/${semesterId}`).then(report => {
                resolve(report)
            }).catch(e => {
                reject(e)
            })
        })
    }

    createSemester(semester) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/semesters/create`, semester).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    updateSemester(semesterId, semester) {
        return new Promise((resolve, reject) => {
            this.perform("put", `/reporting/semesters/${semesterId}`, semester).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    createReportType(reportType) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/types/create`, reportType).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    updateReportType(reportId, reportType) {
        return new Promise((resolve, reject) => {
            this.perform("put", `/reporting/types/${reportId}`, reportType).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    createReport(report) {
        return new Promise((resolve, reject) => {
            this.perform("post", "/reporting/create", report).then(result => {
                resolve(result);
            }).catch(e => {
                reject(e)
            })
        })
    }

    getReportTypes() {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/types/`).then(reports => {
                resolve(reports)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getReportById(reportId) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${reportId}`).then(report => {
                resolve(report)
            }).catch(e => {
                reject(e)
            })
        })
    }

    updateReport(reportId, report) {
        return new Promise((resolve, reject) => {
            this.perform("put", `/reporting/${reportId}`, report).then(report => {
                resolve(report)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getReportFormById(reportId) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${reportId}/form`).then(report => {
                resolve(report)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getReportTypeById(reportTypeId) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/types/${reportTypeId}`).then(report => {
                resolve(report)
            }).catch(e => {
                reject(e)
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
            }).catch(e => {
                reject(e)
            })
        })
    }

    getReportEntries(report_id) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${report_id}/entries`).then(entries => {
                resolve(entries);
            }).catch(e => {
                reject(e)
            })
        })
    }

    deleteReportEntry(report_id, user_email, entry_id) {
        return new Promise((resolve, reject) => {
            this.perform("delete", `/reporting/${report_id}/entries/${user_email}/${entry_id}`).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    changeEntryStatus(report_id, user_email, entry_id, new_status) {
        return new Promise((resolve, reject) => {
            this.perform("put", `/reporting/${report_id}/entries/${user_email}/${entry_id}/status`, {"new_status": new_status}).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    addDescription(report_id, description) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/${report_id}/presetDescription`, {'description': description}).then(result => {
                resolve(result);
            }).catch(e => {
                reject(e)
            })
        })
    }

    createReportEntry(report_id, entry, existing = false) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/${report_id}/entries?checkExisting=${existing}`, entry).then(result => {
                resolve(result);
            }).catch(e => {
                reject(e)
            })
        })
    }


    checkReportPermissions(report_id) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${report_id}/checkPermissions`).then(result => {
                resolve(result["can_manage"])
            }).catch(e => {
                reject(e)
            })
        })
    }


    getApplicableUsers(report_id) {
        return new Promise((resolve, reject) => {
            this.perform("get", `/reporting/${report_id}/applicableUsers`).then(users => {
                resolve(users)
            }).catch(e => {
                reject(e)
            })
        })
    }

    submitReportEntry(report_id, entry) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/${report_id}/form/submit`, entry).then(result => {
                resolve(result);
            }).catch(e => {
                reject(e)
            })
        })
    }

    createReportForm(report_id, form) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/${report_id}/form`, form).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    deleteReportForm(report_id) {
        return new Promise((resolve, reject) => {
            this.perform("delete", `/reporting/${report_id}/form`).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getBulkSheetLink(report_id) {
        return this.baseUri + `/reporting/${report_id}/entries/bulkUpload`
    }

    uploadBulkEntries(report_id, data) {
        return new Promise((resolve, reject) => {
            this.perform("post", `/reporting/${report_id}/entries/bulkUpload`, data).then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
        })
    }
}