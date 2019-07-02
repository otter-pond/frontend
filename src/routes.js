import Login from "./views/archive/Login.jsx";
import Home from "./views/Main/Home.jsx";
import Admin from "./views/Main/Admin.jsx";

/*
export var routes = [
  {
    path: "/",
    name: "archive",
    icon: "tim-icons icon-chart-pie-36",
    component: archive,
    layout: "/dashboard"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "tim-icons icon-atom",
    component: Icons,
    layout: "/dashboard"
  },
  {
    path: "/map",
    name: "Map",
    icon: "tim-icons icon-pin",
    component: Map,
    layout: "/dashboard"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/dashboard"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/dashboard"
  },
  {
    path: "/tables",
    name: "Table List",
    icon: "tim-icons icon-puzzle-10",
    component: TableList,
    layout: "/dashboard"
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "tim-icons icon-align-center",
    component: Typography,
    layout: "/dashboard"
  },
];
*/

export var mainRoutes = [
  {
    path: "home",
    name: "Home",
    icon: "tim-icons icon-align-center",
    component: Home,
    layout: "/"
  },
  {
    path: "admin",
    name: "Admin",
    icon: "tim-icons icon-align-center",
    component: Admin,
    layout: "/"
  },
]

export var authRoutes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    layout: "/auth"
  }
]
