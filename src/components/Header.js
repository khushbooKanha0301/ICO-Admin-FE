import React, { useState, useEffect } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { UserIcon, SettingIcon, LogoutIcon, LoginIcon } from "./SVGIcon";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/AuthenticationSlice";

export const Header = (props) => {
  const [position, setPosition] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleScroll = () => {
      let moving = window.pageYOffset;

      setVisible(position > moving);
      setPosition(moving);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const logoutUser = () => {
    dispatch(logout());
  };

  const cls = visible ? "visible" : "hidden";
  return (
    <div className={`header d-flex ${cls}`}>
      <Navbar.Toggle
        onClick={props.clickHandler}
        className="d-block d-md-none"
        aria-controls="basic-navbar-nav"
      />
      <Nav className="ms-auto" as="ul">
        <Nav.Item as="li" className="login-menu">
          <span className="user-name d-none d-md-block">Welcome ! Admin</span>
        </Nav.Item>
        <NavDropdown
          as="li"
          title={
            <img src={require("../assets/images/avatar.png")} alt="avatar" />
          }
          id="nav-dropdown"
        >
          <NavDropdown.Item onClick={() => logoutUser()}>
            <LogoutIcon width="18" height="18" />
            Sign out
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </div>
  );
};

export default Header;
