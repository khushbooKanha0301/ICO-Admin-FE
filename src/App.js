import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ForgotPasswordComponent from "./components/ForgotPasswordComponent";
import LoginComponent from "./pages/Login";
import DashboardComponent from "./pages/Dashboard";
import KYCListComponent from "./pages/Kyclist";
import UserListComponent from "./pages/Userlist";
import SnackBar from "./snackBar";
import AuthRoute from "./AuthRoute";
import TransactionComponent from "./pages/Transaction";
import ResetPasswordComponent from "./components/ResetPasswordComponent";
import { isAccess } from "./utils";
import { useJwt } from "react-jwt";
import { setSAL } from "./store/slices/AuthenticationSlice";

export const App = () => {
  const [isOpen, setIsOpen] = useState(true);
  const sidebarToggle = () => setIsOpen(!isOpen);
  const [modalShow, setModalShow] = useState(false);
  const modalToggle = () => setModalShow(!modalShow);
  const [isResponsive, setIsResponsive] = useState(false);
  const dispatch = useDispatch();

  const token = localStorage.getItem("token") || "";
  
  const { decodedToken } = useJwt(token);
  useEffect(() => {
    if(decodedToken)
    {
      dispatch(setSAL(decodedToken.access)); 
    }
  },[decodedToken])
  
  const SAL = useSelector((state) => state.authenticationReducer?.SAL) || null;

  const authToken =
    useSelector((state) => state.authenticationReducer?.authToken) || null;

  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Container
        fluid="xxl"
        className={`${isOpen ? "open-sidebar" : ""} ${
          authToken ? "" : "full-page"
        }p-0`}
      >
        <ToastContainer />
        <SnackBar />
        {authToken && (
          <Sidebar
            clickHandler={sidebarToggle}
            setIsOpen={setIsOpen}
            isResponsive={isResponsive}
          />
        )}
        <div className={`${authToken ? "wrapper" : ""}`}>
          {authToken && (
            <Header
              clickHandler={sidebarToggle}
              clickModalHandler={modalToggle}
            />
          )}
          <div className="contain">
            <Routes>
              {authToken ? (
                <>
                  <Route
                    path="/"
                    element={
                      <AuthRoute>
                        <DashboardComponent />{" "}
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/kyc-list"
                    element={
                      <AuthRoute>
                        <KYCListComponent />
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <AuthRoute>
                        <TransactionComponent />
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/users-list"
                    element={
                      <AuthRoute>
                        <UserListComponent />
                      </AuthRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<LoginComponent />} />
                  <Route path="*" element={<Navigate to="/" />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordComponent />}
                  />
                  <Route
                    path="/reset-password"
                    element={<ResetPasswordComponent />}
                  />
                </>
              )}
            </Routes>
          </div>
        </div>
      </Container>
    </>
  );
};

export default App;
