import React from "react";
import ReactDOM from "react-dom";
import { createHashHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "./layouts/Admin/Admin.jsx";
import PlainLayout from "./layouts/Plain/Plain.jsx";
import Cookies from "universal-cookie"

import "./assets/scss/black-dashboard-react.scss";
import "./assets/demo/demo.css";
import "./assets/css/nucleo-icons.css";

const hist = createHashHistory();

const App = () => (
        <Router history={hist}>
            <Switch>
                <Route path="/dashboard" render={props => <AdminLayout {...props} />} />
                <Route path="/" render={props => <PlainLayout {...props} />} />
            </Switch>
        </Router>
)

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
