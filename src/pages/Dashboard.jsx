import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { TokenSale} from "../components/TokenSale";
import {
  CheckCircleIcon,
  CloseIcon,
  ExclamationIcon,
} from "../components/SVGIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  getTokenCount,
  getTotalMid,
  resetRaisedMid,
  resetTokenData,
} from "../store/slices/currencySlice";
import { formattedNumber, getDateFormate } from "../utils";
import jwtAxios from "../service/jwtAxios";
import { getUsersCount } from "../store/slices/UserSlice";

function Dashboard() {
  const MAX = 14000000;
  const [transactions, setTransactions] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [totalUser, setTotalUser] = useState(null);
  // const [totalKYCUser, setTotalKYCUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  // const [sinceLastWeekUserCount, setSinceLastWeekUserCount] = useState(0);
  // const [sinceLastWeekKYCUserCount, setSinceLastWeekKYCUserCount] = useState(0);
  const [sinceLastWeekSale, setSinceLastWeekSale] = useState(0);
  const [userType, setUserType] = useState("user");
  const [transactionLoading, setTransactionLoading] = useState(false);
  const totalUser = useSelector(
    (state) => state.userReducer?.totalUser
  );
  const totalKYCUser = useSelector(
    (state) => state.userReducer?.totalKYCUser
  );
  const sinceLastWeekUserCount = useSelector(
    (state) => state.userReducer?.sinceLastWeekUserCount
  );
  const sinceLastWeekKYCUserCount = useSelector(
    (state) => state.userReducer?.sinceLastWeekKYCUserCount
  );
  const authToken = useSelector(
    (state) => state.authenticationReducer?.authToken
  );
  const { raisedMid, tokenData } = useSelector((state) => state?.currenyReducer);
  useEffect(() => {
    if (authToken) {
      dispatch(getTotalMid()).unwrap();
      dispatch(getTokenCount()).unwrap();
    } else {
      dispatch(resetRaisedMid());
      dispatch(resetTokenData());
    }
  }, [dispatch, authToken]);

  useEffect(() => {
    setTransactionLoading(true);
    setTransactions([]);
    const gettransaction = async () => {
      if (authToken && currentPage) {
        await jwtAxios
          .post(`/transactions/getTransactions?page=1&pageSize=3`)
          .then((res) => {
            setTransactionLoading(false);
            setTransactions(res.data?.transactions);
          })
          .catch((err) => {
            setTransactionLoading(false);
          });
      }
    };
    gettransaction();
  }, [authToken, currentPage]);

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
      };
  }, [authToken]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const viewAllTransactions = () => {
    navigate("/transactions");
  };

  const viewAllUsers = () => {
    if(userType == "user")
    {
      navigate("/users-list");
    }else{
      navigate("/kyc-list");
    }
  };

  const userTypeHandler = (userTypeParam) => {
    setUserType(userTypeParam)
  }

  return (
    <>
      <div className="account-status">
        <Row>
          <Col xl="4">
            <Card body className='green-card'>
              <div className="token-balance">
                <div className="token-avatar"></div>
                <div>
                  <div className="token-text">Amount collected</div>
                  <div className="token-amount">{raisedMid ? formattedNumber(raisedMid) : 0} <span>MID</span></div>
                </div>
              </div>
              <h5>The Contributor</h5>
              <Row>
                <Col>
                  <div className="contribution-amount">{tokenData?.gbpCount}</div>
                  <div className="contribution-label">
                  <img
                    className="currency-flag"
                    src={require("../assets/images/gbp-icon.png")}
                    alt="Bitcoin"
                    style={{ width: "16px", height: "16px" }}
                  />
                  GBP
                  </div>
                </Col>
                <Col>
                  <div className="contribution-amount">{tokenData?.eurCount}</div>
                  <div className="contribution-label">
                  <img
                    className="currency-flag"
                    src={require("../assets/images/eur-icon.png")}
                    alt="Bitcoin"
                    style={{ width: "16px", height: "16px" }}
                  />
                  EUR
                  </div>
                </Col>
                <Col>
                  <div className="contribution-amount">{tokenData?.audCount}</div>
                  <div className="contribution-label">
                  <img
                    className="currency-flag"
                    src={require("../assets/images/aud-icon.png")}
                    alt="Bitcoin"
                    style={{ width: "16px", height: "16px" }}
                  />
                  AUD
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
                  <div className="coin-number">{ raisedMid !== null ? parseFloat(formattedNumber(MAX - raisedMid)).toLocaleString() : 0} <Badge bg="success">0,2 %</Badge></div>
                  <p>{sinceLastWeekSale?sinceLastWeekSale:0} since last week</p>
                  <Button variant="primary" size="sm" onClick={viewAllTransactions}>View all</Button>
                </Col>
                <Col md="6">
                  <h4>{userType == "user" ? "total users" : "total KYC"} 
                    <div className="buttongroup">
                      <button className={userType == "kycUser" ? "active" : ""} onClick={() => userTypeHandler("kycUser")}>KYC</button>
                      <button className={userType == "user" ? "active" : ""} onClick={() => userTypeHandler("user")}>User</button>
                    </div>
                  </h4>
                  <div className="coin-number">{userType == "user" ? totalUser : totalKYCUser} <Badge bg="success">85 %</Badge></div>
                  <p>{userType == "user" ? sinceLastWeekUserCount : sinceLastWeekKYCUserCount} since last week</p>
                  <Button variant="primary" size="sm" onClick={viewAllUsers}>View all</Button>
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
              <Card.Title as="h4">Token Sale Graph <Link to="/transactions">View all</Link></Card.Title>
              <Table responsive>
                <thead>
                  <tr>
                    <th width="110">Token</th>
                    <th width="110">Amount</th>
                    <th width="154">Date</th>
                    <th width="97"></th>
                    </tr>
                  </thead>
                <tbody>
                {transactions?.slice(0, 3).map((transaction) => (
                    <tr key={transaction?._id}>
                      <td>
                        {transaction?.status == "paid" && (
                          <CheckCircleIcon width="16" height="16" />
                        )}
                        {(transaction?.status == "canceled" ||
                          transaction?.status == "expired" ||
                          transaction?.status == "invalid") && (
                          <CloseIcon width="16" height="16" />
                        )}
                        {(transaction?.status == "new" ||
                          transaction?.status == "pending") && (
                          <ExclamationIcon width="16" height="16" />
                        )}
                        {formattedNumber(transaction?.token_cryptoAmount)}
                      </td>
                      <td>
                        <p className="text-white mb-1">
                          {formattedNumber(transaction?.price_amount)}{" "}
                          {transaction?.price_currency}
                        </p>
                      </td>
                      <td>{getDateFormate(transaction?.created_at)}</td>
                      <td style={{ textAlign: "right" }}>
                        <Button variant="outline-success">
                        {transaction.source ? transaction.source.charAt(0).toUpperCase() + transaction.source.slice(1) : "Purchase"}
                        </Button>
                        
                      </td>
                    </tr>
                  ))}
                  {(transactions?.length === 0 && transactionLoading === false) && (
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
            <Card body className="cards-dark h-100 mt-3 mt-lg-0">

            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
