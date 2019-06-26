import Dashboard from "./views/Dashboard.jsx";
import Icons from "./views/Icons.jsx";
import Map from "./views/Map.jsx";
import Notifications from "./views/Notifications.jsx";
import TableList from "./views/TableList.jsx";
import Typography from "./views/Typography.jsx";
import UserProfile from "./views/UserProfile.jsx";
import Login from "./views/Login.jsx";

export var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
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

export var plainRoutes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    layout: "/"
  }
]
