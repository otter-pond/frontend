import React from "react";
import ReactDOM from "react-dom";
import { createHashHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "./layouts/Auth/Auth.jsx";
import MainLayout from "./layouts/Main/Main.jsx";

import "./assets/scss/black-dashboard-react.scss";
import "./assets/demo/demo.css";
import "./assets/css/nucleo-icons.css";

const hist = createHashHistory();

console.log(process.env);

const App = () => (
        <Router history={hist}>
            <Switch>
                <Route path="/auth" render={props => <AuthLayout {...props} />} />
                <Route path="/" render={props => <MainLayout {...props} />} />
            </Switch>
        </Router>
)

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
