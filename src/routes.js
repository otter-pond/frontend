import Login from "./views/Auth/Login.jsx";
import ResetRequest from "./views/Auth/ResetRequest.jsx";
import Home from "./views/Main/Home.jsx";
import Admin from "./views/Main/Admin.jsx";
import Reporting from "./views/Main/Reporting.jsx";
import Attendance from "./views/Main/Attendance.jsx";
import ProfileSettings from "./views/Main/ProfileSettings.jsx"
import ResetPassword from "./views/Auth/ResetPassword.jsx"
import VerifySuccess from "./views/Auth/VerifySuccess.jsx"
import VerifyFailure from "./views/Auth/VerifyFailure.jsx"


let homeRoute = {
  path: "/home",
  name: "Home",
  icon: "tim-icons icon-align-center",
  component: Home,
  layout: "/main"
}

let adminRoute = {
      path: "/admin",
      name: "Admin",
      icon: "tim-icons icon-align-center",
      component: Admin,
      layout: "/main"
}

let reportingRoute = {
  path: "/reporting",
  name: "Reporting",
  icon: "tim-icons icon-align-center",
  component: Reporting,
  layout: "/main"
}

let attendanceRoute = {
  path: "/attendance",
  name: "Attendance",
  icon: "tim-icons icon-align-center",
  component: Attendance,
  layout: "/main"
}

let profileSettingsRoute = {
  path: "/profileSettings",
  name: "Profile & Settings",
  icon: "tim-icons icon-align-center",
  component: ProfileSettings,
  layout: "/main"
}


export function getMainRoutesForUser(role, permissions){
  let routes = [homeRoute, reportingRoute, profileSettingsRoute]

  if (permissions && permissions.includes("full_admin")) {
    routes.push(adminRoute)
  }

  if (permissions && (permissions.includes("full_admin") || permissions.includes("can_take_attendance"))) {
    routes.push(attendanceRoute)
  }

  return routes
}

export var authRoutes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/reset",
    name: "Reset",
    component: ResetRequest,
    layout: "/auth"
  },
  {
    path: "/resetpassword",
    name: "Reset Password",
    component: ResetPassword,
    layout: "/auth"
  },
  {
    path: "/verifySuccess",
    name: "Verify Success",
    component: VerifySuccess,
    layout: "/auth"
  },
  {
    path: "/verifyFailure",
    name: "Verify Failure",
    component: VerifyFailure,
    layout: "/auth"
  },
]

