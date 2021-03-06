import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import FixedPlugin from "../../components/FixedPlugin/FixedPlugin.jsx";
import APIClient from "../../api/APIClient"

import { getMainRoutesForUser } from "../../routes.js";

import logo from "../../assets/img/react-logo.png";
import Cookies from "universal-cookie";

const cookies = new Cookies();
let role = cookies.get("role")
let permissions = cookies.get("permissions")
let mainRoutes = getMainRoutesForUser(role, permissions)

var ps;

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "blue",
            sidebarOpened:
                document.documentElement.className.indexOf("nav-open") !== -1
        };

        const client = new APIClient()
        client.checkAuthentication().then(() => {
            console.log("User Logged In")
        }).catch(() => {
            const { history } = this.props;
            history.replace("/auth/login")
        })
    }
    componentDidMount() {
        if (navigator.platform.indexOf("Win") > -1) {
            document.documentElement.className += " perfect-scrollbar-on";
            document.documentElement.classList.remove("perfect-scrollbar-off");
            ps = new PerfectScrollbar(this.refs.mainPanel, { suppressScrollX: true });
            let tables = document.querySelectorAll(".table-responsive");
            for (let i = 0; i < tables.length; i++) {
                ps = new PerfectScrollbar(tables[i]);
            }
        }
    }
    componentWillUnmount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps.destroy();
            document.documentElement.className += " perfect-scrollbar-off";
            document.documentElement.classList.remove("perfect-scrollbar-on");
        }
    }
    componentDidUpdate(e) {
        if (e.history.action === "PUSH") {
            if (navigator.platform.indexOf("Win") > -1) {
                let tables = document.querySelectorAll(".table-responsive");
                for (let i = 0; i < tables.length; i++) {
                    ps = new PerfectScrollbar(tables[i]);
                }
            }
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
            this.refs.mainPanel.scrollTop = 0;
        }
    }
    // this function opens and closes the sidebar on small devices
    toggleSidebar = () => {
        document.documentElement.classList.toggle("nav-open");
        this.setState({ sidebarOpened: !this.state.sidebarOpened });
    };
    getRoutes = mainRoutes => {

        return mainRoutes.map((prop, key) => {
            if (prop.layout === "/main") {
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
    handleBgClick = color => {
        this.setState({ backgroundColor: color });
    };
    getBrandText = path => {
        for (let i = 0; i < mainRoutes.length; i++) {
            if (
                this.props.location.pathname.indexOf(
                    mainRoutes[i].layout + mainRoutes[i].path
                ) !== -1
            ) {
                return mainRoutes[i].name;
            }
        }
        return "Brand";
    };
    render() {
        return (
            <>
                <div className="wrapper">

                    <Sidebar
                        {...this.props}
                        routes={mainRoutes}
                        bgColor={this.state.backgroundColor}
                        logo={{
                            outterLink: "",
                            text: "Otter Pond",
                            //imgSrc: logo
                        }}
                        toggleSidebar={this.toggleSidebar}
                    />
                    <div
                        className="main-panel"
                        ref="mainPanel"
                        data={this.state.backgroundColor}
                    >
                        <AdminNavbar
                            {...this.props}
                            brandText={this.getBrandText(this.props.location.pathname)}
                            toggleSidebar={this.toggleSidebar}
                            sidebarOpened={this.state.sidebarOpened}
                        />
                        <Switch>{this.getRoutes(mainRoutes)}</Switch>
                        <Footer fluid />
                    </div>
                </div>
                {/*<FixedPlugin
                    bgColor={this.state.backgroundColor}
                    handleBgClick={this.handleBgClick}
                />*/}
            </>
        );
    }
}

export default Main;
