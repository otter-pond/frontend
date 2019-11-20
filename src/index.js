import React from "react";
import ReactDOM from "react-dom";
import { createHashHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import config from "./variables/config"
import {StripeProvider} from 'react-stripe-elements';

import AuthLayout from "./layouts/Auth/Auth.jsx";
import MainLayout from "./layouts/Main/Main.jsx";

import "./assets/scss/black-dashboard-react.scss";
import "./assets/demo/demo.css";
import "./assets/css/nucleo-icons.css";

const hist = createHashHistory();

console.log(process.env);

const App = () => (
    <StripeProvider apiKey={config.stripePublicKey}>
        <Router history={hist}>
            <Switch>
                <Route path="/auth" render={props => <AuthLayout {...props} />} />
                <Route path="/main" render={props => <MainLayout {...props} />} />
                <Redirect exact from="/" to="/main/home" />
            </Switch>
        </Router>
    </StripeProvider>
)

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
