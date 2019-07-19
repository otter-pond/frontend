import React from "react";
import { Route, Switch } from "react-router-dom";

import { authRoutes }  from "../../routes.js";

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "blue",
    };
  }
  getRoutes = authRoutes => {
    return authRoutes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  render() {
    return (
      <>
        <div className="wrapper">
          <div
            className="main-panel" data="blue"
          >
            <Switch>{this.getRoutes(authRoutes)}</Switch>
          </div>
        </div>
      </>
    );
  }
}

export default Auth;
