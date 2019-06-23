import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin/Admin.jsx";
import PlainLayout from "layouts/Plain/Plain.jsx";
import Cookies from "universal-cookie"

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";

//import {AuthProvider, AuthConsumer} from 'react-check-auth';
import config from "variables/config"


const cookies = new Cookies()

// const authUrl = config.apiGateway + "/auth/checkLoginStatus";
// const reqOptions = {
//     'method': 'GET',
//     'headers': {
//         'Content-Type': 'application/json',
//         'Authorization' : 'Bearer ' + cookies.get("accessToken")
//     },
// };
const hist = createBrowserHistory();

const App = () => (
    //<AuthProvider authUrl={authUrl} reqOptions={reqOptions}>
        <Router history={hist}>
            <Switch>
                <Route path="/dashboard" render={props => <AdminLayout {...props} />} />
                <Route path="/" render={props => <PlainLayout {...props} />} />
            </Switch>
        </Router>

    //</AuthProvider>
)

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
