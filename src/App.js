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
import SubAdminlistComponent from "./pages/SubAdminlist";
import ResetPasswordComponent from "./components/ResetPasswordComponent";
import { useJwt } from "react-jwt";
import { setSAL } from "./store/slices/AuthenticationSlice";
import { checkCurrentSale } from "./store/slices/currencySlice";
import { database, firebaseMessages } from "./config";
import { ref, get, update } from "@firebase/database";
import { notificationFail , notificationSuccess} from "./store/slices/notificationSlice";
import moment from "moment";
import jwtAxios from "./service/jwtAxios";
import * as flatted from "flatted";

let PageSize = 5;
export const App = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const sidebarToggle = () => setIsOpen(!isOpen);
  const [modalShow, setModalShow] = useState(false);
  const modalToggle = () => setModalShow(!modalShow);
  const [isResponsive, setIsResponsive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState(null);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);
  const [transactionLoading, setTransactionLoading] = useState(true);

  const [isTypeChecked, setIsTypeChecked] = useState(
    flatted.parse(flatted.stringify([]))
  );
  const [isStatusChecked, setIsStatusChecked] = useState(
    flatted.parse(flatted.stringify([]))
  );
  const [searchTrnx, setSearchTrnx] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const authToken =
    useSelector((state) => state.authenticationReducer?.authToken) || null;
  let roleId =
    useSelector((state) => state.authenticationReducer?.roleId) || null;
  roleId = Number(roleId);

  const token = localStorage.getItem("token") || "";
  const { decodedToken } = useJwt(token);

  useEffect(() => {
    if (decodedToken && roleId) {
      dispatch(setSAL(decodedToken.access));
      dispatch(checkCurrentSale());
    }
  }, [decodedToken, roleId]);

  const SAL = useSelector((state) => state.authenticationReducer?.SAL) || null;

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

  const gettransaction = async (isTypeChecked , isStatusChecked) => {
    let filter = { types: isTypeChecked, status: isStatusChecked };
    if (currentPage) {
      await jwtAxios
      .post(
        `/transactions/getTransactions?query=${
          searchTrnx ? searchTrnx : null
        }&statusFilter=${
          statusFilter ? statusFilter : null
        }&page=${currentPage}&pageSize=${PageSize}`,
        filter
      )
      .then((res) => {
        setTransactionLoading(false);
        setTransactions(res.data?.transactions);
        setTotalTransactionsCount(res.data?.totalTransactionsCount);
      })
      .catch((err) => {
        setTransactionLoading(false);
      });
    }
  };

  useEffect(() => {
    if(authToken) {
      gettransaction(isTypeChecked , isStatusChecked);
    }
  }, [currentPage, authToken, isTypeChecked , isStatusChecked]);

  useEffect(() => {
    const userRef = ref(
      database,
      firebaseMessages?.ICO_TRANSACTIONS
    );

    const updateLastActive = () => {
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const transactions = snapshot.val();
          for (const [key, value] of Object.entries(transactions)) {
            const dateMoment = moment.utc(value?.lastActive);
            const currentMoment = moment.utc();
            const differenceInMinutes = currentMoment.diff(dateMoment, 'minutes');
            if(authToken){
              if (!value.is_pending  && !value.is_open) {
                if(differenceInMinutes < 1){
                dispatch(notificationFail(`Outside Transaction Pending`));
                gettransaction(isTypeChecked , isStatusChecked);
                  const userUpdateRef = ref(
                    database,
                    firebaseMessages?.ICO_TRANSACTIONS  + "/" + key
                  );
                  update(userUpdateRef, {
                    lastActive: Date.now(),
                    is_pending: true
                  });
                }
              }
              if (!value.is_open && value.is_pending && value.status == "paid") {
                if(differenceInMinutes < 1){
                dispatch(notificationSuccess(`Outside Transaction Successfull`));
                gettransaction(isTypeChecked , isStatusChecked);
                const userUpdateRef = ref(
                  database,
                  firebaseMessages?.ICO_TRANSACTIONS  + "/" + key
                );
                update(userUpdateRef, {
                  lastActive: Date.now(),
                  is_open: true
                });
                }
              }
            }
          }
        } 
      }).catch((error) => {
        console.error("Error fetching data:", error);
      });
    };

    const interval = setInterval(function () {
      updateLastActive()
    }, 1000); // 5 seconds in milliseconds
    
    window.addEventListener("beforeunload", updateLastActive());
    window.addEventListener("mousemove", updateLastActive());
    window.addEventListener("keydown", updateLastActive());
    window.addEventListener("scroll", updateLastActive());
    window.addEventListener("click", updateLastActive());

    // Clean up the listeners when the component unmounts or user logs out
    return () => {
      window.removeEventListener("beforeunload", updateLastActive());
      window.removeEventListener("mousemove", updateLastActive());
      window.removeEventListener("keydown", updateLastActive());
      window.removeEventListener("scroll", updateLastActive());
      window.removeEventListener("click", updateLastActive());
      clearInterval(interval);
    }

  }, [authToken]);

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
            roleId={roleId}
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
                  {roleId === 1 && (
                    <Route
                      path="/admins"
                      element={
                        <AuthRoute>
                          <SubAdminlistComponent />
                        </AuthRoute>
                      }
                    />
                  )}
                  <Route
                    path="/"
                    element={
                      <AuthRoute>
                        <DashboardComponent transactionLoading={transactionLoading} transactions={transactions} />{" "}
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/kyc-list"
                    element={
                      <AuthRoute>
                        <KYCListComponent roleId={roleId} />
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <AuthRoute>
                        <TransactionComponent setCurrentPage={setCurrentPage} 
                        transactionLoading={transactionLoading} transactions={transactions} 
                        totalTransactionsCount={totalTransactionsCount} gettransaction={gettransaction}
                        isTypeChecked={isTypeChecked} setIsTypeChecked={setIsTypeChecked}
                        isStatusChecked={isStatusChecked} setIsStatusChecked={setIsStatusChecked}
                        setSearchTrnx={setSearchTrnx} setStatusFilter={setStatusFilter}
                        searchTrnx={searchTrnx} statusFilter={statusFilter}
                        PageSize={PageSize} currentPage={currentPage}
                        />
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/users-list"
                    element={
                      <AuthRoute>
                        <UserListComponent roleId={roleId} />
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
