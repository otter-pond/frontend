import Login from "./views/Auth/Login.jsx";
import ResetRequest from "./views/Auth/ResetRequest.jsx";
import Home from "./views/Main/Home.jsx";
import Admin from "./views/Main/Admin.jsx";
import Reporting from "./views/Main/Reporting.jsx";
import ResetPassword from "./views/Auth/ResetPassword.jsx"


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

export function getMainRoutesForUser(role, permissions){
  let routes = [homeRoute, reportingRoute]

  if (permissions && permissions.includes("full_admin")) {
    routes.push(adminRoute)
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
]

