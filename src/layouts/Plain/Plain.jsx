import React from "react";
import { Route, Switch } from "react-router-dom";

// core components
import Footer from "components/Footer/Footer.jsx";

import plainRoutes from "routes.js";

var ps;

class Plain extends React.Component {
  constructor(props) {
    super(props);
  }
  getRoutes = plainRoutes => {
    return plainRoutes.map((prop, key) => {
      if (prop.layout === "/") {
        return (
          <Route
            path={prop.path}
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
            className="main-panel"
            ref="mainPanel"
          >
            <Switch>{this.getRoutes(plainRoutes)}</Switch>
          </div>
        </div>
      </>
    );
  }
}

export default Plain;
