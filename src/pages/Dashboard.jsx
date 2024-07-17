import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { TokenSale } from "../components/TokenSale";
import {
  CheckCircleIcon,
  CloseIcon,
  ExclamationIcon,
} from "../components/SVGIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  getTokenCount,
  getTotalMid,
  resetTokenData,
} from "../store/slices/currencySlice";
import { formattedNumber, getDateFormate } from "../utils";
import jwtAxios from "../service/jwtAxios";
import { getUsersCount } from "../store/slices/UserSlice";

function Dashboard(props) {
  const {transactionLoading , transactions } = props;
  //const [transactions, setTransactions] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sinceLastWeekSale, setSinceLastWeekSale] = useState(0);
  const [userType, setUserType] = useState("user");
  //const [transactionLoading, setTransactionLoading] = useState(false);
  const { sales } = useSelector((state) => state?.currenyReducer);

  const totalUser = useSelector((state) => state.userReducer?.totalUser);
  const totalKYCUser = useSelector((state) => state.userReducer?.totalKYCUser);
  const sinceLastWeekUserCount = useSelector(
    (state) => state.userReducer?.sinceLastWeekUserCount
  );
  const sinceLastWeekKYCUserCount = useSelector(
    (state) => state.userReducer?.sinceLastWeekKYCUserCount
  );
  const authToken = useSelector(
    (state) => state.authenticationReducer?.authToken
  );
  const { tokenData } = useSelector((state) => state?.currenyReducer);

  useEffect(() => {
    if (authToken) {
      dispatch(getTotalMid()).unwrap();
      dispatch(getTokenCount()).unwrap();
    } else {
      dispatch(resetTokenData());
    }
  }, [dispatch, authToken]);

  useEffect(() => {
    const getDashboardTransactionData = async () => {
      if (authToken && currentPage) {
        await jwtAxios
          .get(`/transactions/getDashboardTransactionData`)
          .then((res) => {
            setSinceLastWeekSale(res.data?.sinceLastWeekSale);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    getDashboardTransactionData();
  }, [authToken]);
  useEffect(() => {
    if (authToken) {
      dispatch(getUsersCount());
    }
  }, [authToken]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const viewAllTransactions = () => {
    navigate("/transactions");
  };

  const viewAllUsers = () => {
    if (userType == "user") {
      navigate("/users-list");
    } else {
      navigate("/kyc-list");
    }
  };

  const userTypeHandler = (userTypeParam) => {
    setUserType(userTypeParam);
  };

  return (
    <>
      <div className="account-status">
        <Row>
          <Col xl="4">
            <Card body className="green-card">
              <div className="token-balance">
                <div className="token-avatar"></div>
                <div>
                  <div className="token-text">Amount collected</div>
                  <div className="token-amount">
                    {" "}
                    {tokenData && tokenData?.totalUserCount
                      ? tokenData?.totalUserCount
                      : 0.0}
                  </div>
                </div>
              </div>
              <h5>The Contributor</h5>
              <Row>
                <Col>
                  <div className="contribution-amount">
                    {tokenData && tokenData?.totalUsdtCount}
                  </div>
                  <div className="contribution-label">
                    <img
                      className="currency-flag"
                      src={require("../assets/images/usdt-icon.png")}
                      alt="Bitcoin"
                      style={{ width: "16px", height: "16px" }}
                    />
                    USDT
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl="8">
            <Card body className="cards-dark h-100">
              <Row>
                <Col md="6">
                  <h4>TOKEN SALE - COIN</h4>
                  {/* <div className="coin-number">{ raisedMid !== null ? parseFloat(formattedNumber(MAX - raisedMid)).toLocaleString() : 0} <Badge bg="success">0,2 %</Badge></div> */}
                  <div className="coin-number">
                    {sales && sales?.total ? sales?.total : 0}
                    <Badge bg="success">0,2 %</Badge>
                  </div>
                  <p>
                    {sinceLastWeekSale ? sinceLastWeekSale : 0} since last week
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={viewAllTransactions}
                  >
                    View all
                  </Button>
                </Col>
                <Col md="6">
                  <h4>
                    {userType == "user" ? "total users" : "total KYC"}
                    <div className="buttongroup">
                      <button
                        className={userType == "kycUser" ? "active" : ""}
                        onClick={() => userTypeHandler("kycUser")}
                      >
                        KYC
                      </button>
                      <button
                        className={userType == "user" ? "active" : ""}
                        onClick={() => userTypeHandler("user")}
                      >
                        User
                      </button>
                    </div>
                  </h4>
                  <div className="coin-number">
                    {userType == "user" ? totalUser : totalKYCUser}{" "}
                    <Badge bg="success">85 %</Badge>
                  </div>
                  <p>
                    {userType == "user"
                      ? sinceLastWeekUserCount
                      : sinceLastWeekKYCUserCount}{" "}
                    since last week
                  </p>
                  <Button variant="primary" size="sm" onClick={viewAllUsers}>
                    View all
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="token-sale">
        <Row>
          <Col lg="8">
            <Card body className="cards-dark transaction-list">
              <Card.Title as="h4">
                Token Sale Graph <Link to="/transactions">View all</Link>
              </Card.Title>
              <Table responsive>
                <thead>
                  <tr>
                  <th width="70">Token</th>
                    <th width="90">Amount</th>
                    <th width="150">Date</th>
                    <th width="80">Type</th>
                    <th width="100"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.slice(0, 3).map((transaction) => (
                    <tr key={transaction?._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {transaction?.status == "paid" && (
                            <CheckCircleIcon width="16" height="16" />
                          )}
                          {(transaction?.status == "failed") && (
                            <CloseIcon width="16" height="16" />
                          )}
                           {(transaction?.status == "pending") && (
                            <ExclamationIcon width="16" height="16" />
                          )}
                         {transaction?.is_sale && transaction?.is_process ? transaction?.token_cryptoAmount <= 200
                            ? formattedNumber(transaction?.token_cryptoAmount)
                            : "+200" : "0.00" }
                        </div>
                      </td>
                      <td>
                        <p className="text-white mb-1">
                          {formattedNumber(transaction?.price_amount)}{" "}
                          {transaction?.price_currency}
                        </p>
                      </td>
                      <td>{getDateFormate(transaction?.created_at)}</td>
                      <td> {transaction?.sale_type == "website" ? "Website": "Outside-Web"}</td>
                      <td style={{ textAlign: "right" }}>
                        {transaction?.status == "paid" && (
                          <Button variant="outline-success">Confirmed</Button>
                        )}
                        {transaction?.status == "failed" && (
                          <Button variant="outline-danger">Failed</Button>
                        )}
                        {transaction?.status == "pending" && (
                          <Button variant="outline-pending">Unconfirmed</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {transactions?.length === 0 &&
                    transactionLoading === false && (
                      <tr>
                        <td colSpan={4} style={{ paddingTop: "30px" }}>
                          <p
                            className="text-center"
                            style={{ color: "rgba(255,255,255,0.2)" }}
                          >
                            No History Records
                          </p>
                        </td>
                      </tr>
                    )}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col lg="4">
            <Card body className="cards-dark h-100">
              <Card.Title as="h4">Registrations Statistics</Card.Title>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="token-sale-graph">
        <Row>
          <Col lg="8">
            <TokenSale />
          </Col>
          <Col lg="4">
            <Card body className="cards-dark h-100 mt-3 mt-lg-0"></Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
