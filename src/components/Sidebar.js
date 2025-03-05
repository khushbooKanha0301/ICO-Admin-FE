import React, { useEffect, useState } from "react";
import { Navbar, Nav, Button, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import Highcharts from "highcharts/highstock";
import {
  EscrowIcon,
  HomeIcon,
  QuestionIcon,
  TradeHistoryIcon,
} from "./SVGIcon";
export const Sidebar = (props) => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState();

  const handleResizePage = () => {
    if (Highcharts.charts) {
      Highcharts.charts.map((val) => {
        if (val) {
          setTimeout(() => val.reflow(), 200);
        }
        return val;
      });
    }
  };
  useEffect(() => {
    // Update the active key based on the current URL
    setActiveKey(location.pathname);
    if (props.isResponsive) {
      props.setIsOpen(false);
    }
  }, [location, props.isResponsive]);

  return (
    <div className="sidebar">
      <div className="d-flex nav-header">
        <Navbar.Brand className="menu-hide" as={Link} to="/">
          <img src={require("../assets/images/icon-logo.png")} alt="Ico App" />
        </Navbar.Brand>
        <Navbar.Toggle
          onClick={() => {
            props.clickHandler();
            handleResizePage();
          }}
          aria-controls="basic-navbar-nav"
        />
      </div>
      <div className="sidebar-scroll">
        <PerfectScrollbar options={{ suppressScrollX: true }}>
          <div className="nav-title">Ico App</div>
          <>
            <Nav as="ul" activeKey={activeKey}>
              <Nav.Item as="li">
                <Nav.Link
                  as={Link}
                  eventKey="/"
                  to="/"
                  className={activeKey === "/" && "active"}
                >
                  <HomeIcon width="24" height="24" />{" "}
                  <span className="menu-hide">Dashboard</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  as={Link}
                  eventKey="transactions"
                  to="/transactions"
                  className={activeKey === "/transactions" && "active"}
                >
                  <EscrowIcon width="24" height="24" />{" "}
                  <span className="menu-hide">Transactions</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  as={Link}
                  eventKey="kyc-list"
                  to="/kyc-list"
                  className={activeKey === "/kyc-list" && "active"}
                >
                  <TradeHistoryIcon width="24" height="24" />{" "}
                  <span className="menu-hide">KYC List</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  as={Link}
                  eventKey="user-list"
                  to="/users-list"
                  className={activeKey === "/users-list" && "active"}
                >
                  <QuestionIcon width="24" height="24" />{" "}
                  <span className="menu-hide">User List</span>
                </Nav.Link>
              </Nav.Item>

              {props.roleId === 1 && (
                <>
                  <Nav.Item as="li">
                    <Nav.Link
                      as={Link}
                      eventKey="admins"
                      to="/admins"
                      className={activeKey === "/admins" && "active"}
                    >
                      <QuestionIcon width="24" height="24" />{" "}
                      <span className="menu-hide">Admins</span>
                    </Nav.Link>
                  </Nav.Item>
                </>
              )}
              <Nav.Item as="li">
                <Nav.Link
                  as={Link}
                  eventKey="ico-sto-stage"
                  to="/ico-sto-stage"
                  className={activeKey === "/ico-sto" && "active"}
                >
                  <QuestionIcon width="24" height="24" />{" "}
                  <span className="menu-hide">ICO/STO Stage</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  as={Link}
                  eventKey="profile"
                  to="/profile"
                  className={activeKey === "/profile" && "active"}
                >
                  <QuestionIcon width="24" height="24" />{" "}
                  <span className="menu-hide">Profile</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  as={Link}
                  eventKey="settings"
                  to="/settings"
                  className={activeKey === "/settings" && "active"}
                >
                  <QuestionIcon width="24" height="24" />{" "}
                  <span className="menu-hide">Settings</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </>
        </PerfectScrollbar>
      </div>
      <Card className="cards-dark menu-hide">
        <Card.Body>
          <Card.Title>Contact us</Card.Title>
          <Card.Text>
            For all inquiries, please email us using the form below
          </Card.Text>
          <Button variant="primary">Contact us</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Sidebar;
