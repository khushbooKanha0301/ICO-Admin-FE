import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup
} from "react-bootstrap";
import {
  CheckCircleIcon,
  CloseIcon,
  ExclamationIcon,
  EyeIcon,
  SettingIcon,
  SearchIcon,
} from "../components/SVGIcon";
import TransactionDetails from "../components/TransactionDetails";
import jwtAxios from "../service/jwtAxios";
import { formattedNumber, getDateFormate } from "../utils";
import PaginationComponent from "../components/Pagination";
import * as flatted from "flatted";
let PageSize = 5;
function Transaction() {
  const [modalShow, setModalShow] = useState(false);
  const [transactions, setTransactions] = useState(null);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);
  const [stateTransactions, setStateTransactions] = useState(null);
  const [searchTrnx, setSearchTrnx] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  // const [isTypeChecked, setIsTypeChecked] = useState([]);
  // const [isStatusChecked, setIsStatusChecked] = useState([]);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  const [isTypeChecked, setIsTypeChecked] = useState(
    flatted.parse(flatted.stringify([]))
  );
  const [isStatusChecked, setIsStatusChecked] = useState(
    flatted.parse(flatted.stringify([]))
  );

  const modalToggle = (e, transaction) => {
    setModalShow(!modalShow);
    setStateTransactions(transaction);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const gettransaction = async () => {
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
    if (isComponentMounted) {
      const delayApiCall = setTimeout(() => {
        setDebouncedSearchValue(searchTrnx);
      }, 1000);

      return () => clearTimeout(delayApiCall);
    }
  }, [searchTrnx, isComponentMounted]);

  useEffect(() => {
    if (isComponentMounted) {
      setCurrentPage(1);
      gettransaction();
    }
  }, [debouncedSearchValue, statusFilter, isTypeChecked, isStatusChecked, isComponentMounted]);

  useEffect(() => {
    gettransaction();
    setIsComponentMounted(true);
  }, [currentPage]);

  const setSearchQuery = (e) => {
    setSearchTrnx(e.target.value);
  };
  const changeStatus = (status) => {
    setStatusFilter(status);
  };

  // const onSelectTypes = (e, types) => {
  //   if (e.target.checked) {
  //     setIsTypeChecked((prevValues) => [...prevValues, types]);
  //   } else {
  //     setIsTypeChecked((prevValues) => prevValues.filter((v) => v !== types));
  //   }
  //   setCurrentPage(1);
  // };

  const handleFilterTypeChange = (filterType) => {
    setIsTypeChecked((prevValues) => {
      if (prevValues.includes(filterType)) {
        return prevValues.filter((f) => f !== filterType);
      } else {
        return [...prevValues, filterType];
      }
    });
    setCurrentPage(1);
  };

  // const onSelectStatus = (e, status) => {
  //   if (e.target.checked) {
  //     setIsStatusChecked((prevValues) => [...prevValues, status]);
  //   } else {
  //     setIsStatusChecked((prevValues) =>
  //       prevValues.filter((v) => v !== status)
  //     );
  //   }
  //   setCurrentPage(1);
  // };

  const handleFilterStatusChange = (event) => {
    setIsStatusChecked((prevValues) => {
      if (prevValues.includes(event)) {
        return prevValues.filter((f) => f !== event);
      } else {
        return [...prevValues, event];
      }
    });
    setCurrentPage(1);
  };

  return (
    <div className="transaction-view">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Transactions</h2>
        <Button variant="primary" className="contact-btn">
          Contact us
        </Button>
      </div>
      <div className="table-responsive transition-table">
        <div className="flex-table">
          <div className="flex-table-top">
            <ButtonGroup aria-label="filter-btn">
              <Button
                onClick={() => changeStatus("All")}
                className={statusFilter === "All" ? "active" : ""}
                variant="outline-secondary"
              >
                All
              </Button>
              <Button
                onClick={() => changeStatus("new")}
                className={statusFilter === "new" ? "active" : ""}
                variant="outline-secondary"
              >
                New
              </Button>
              <Button
                onClick={() => changeStatus("pending")}
                className={statusFilter === "pending" ? "active" : ""}
                variant="outline-secondary"
              >
                Pending
              </Button>
              <Button
                onClick={() => changeStatus("paid")}
                className={statusFilter === "paid" ? "active" : ""}
                variant="outline-secondary"
              >
                Paid
              </Button>
              <Button
                onClick={() => changeStatus("expired")}
                className={statusFilter === "expired" ? "active" : ""}
                variant="outline-secondary"
              >
                Expired
              </Button>
            </ButtonGroup>
            <InputGroup>
              <SearchIcon width="32" height="32" />
              <Form.Control
                placeholder="Search Tranx"
                aria-label="Search-Tranx"
                aria-describedby="Search-Tranx"
                value={searchTrnx}
                onChange={(e) => {
                  setSearchQuery(e);
                }}
              />
            </InputGroup>
            <DropdownButton
              id="setting-dropdown"
              variant="secondary"
              drop="start"
              autoClose="outside"
              title={<SettingIcon width="24" height="24" />}
            >
              <div className="dropdown-title">TYPES</div>
              {/* <Form.Check
                label="Referral"
                name="setting-type"
                type="checkbox"
                id="setting-type"
                onChange={(e) => onSelectTypes(e, "referral")}
              />

              <Form.Check
                label="Purchase"
                name="setting-type"
                type="checkbox"
                id="setting-type1"
                onChange={(e) => onSelectTypes(e, "purchase")}
              /> */}

              <div
                className="form-check"
                onClick={() => handleFilterTypeChange("referral")}
              >
                <div
                  className={`form-check-input ${
                    isTypeChecked.includes("referral") ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">Referral</label>
              </div>
              <div
                className="form-check"
                onClick={() => {
                  handleFilterTypeChange("purchase");
                }}
              >
                <div
                  className={`form-check-input ${
                    isTypeChecked.includes("purchase") ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">Purchase</label>
              </div>

              <Dropdown.Divider />
              <div className="dropdown-title">STATUS</div>

              <div
                className="form-check"
                onClick={() => handleFilterStatusChange("new")}
              >
                <div
                  className={`form-check-input ${
                    isStatusChecked.includes("new") ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">New</label>
              </div>

              <div
                className="form-check"
                onClick={() => handleFilterStatusChange("pending")}
              >
                <div
                  className={`form-check-input ${
                    isStatusChecked.includes("pending") ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">Pending</label>
              </div>

              <div
                className="form-check"
                onClick={() => handleFilterStatusChange("paid")}
              >
                <div
                  className={`form-check-input ${
                    isStatusChecked.includes("paid") ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">Paid</label>
              </div>

              <div
                className="form-check"
                onClick={() => handleFilterStatusChange("expired")}
              >
                <div
                  className={`form-check-input ${
                    isStatusChecked.includes("expired") ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">Expired</label>
              </div>

              {/* <Form.Check
                label="New"
                name="setting-status"
                type="checkbox"
                id="setting-status"
                onChange={(e) => onSelectStatus(e, "new")}
              />

              <Form.Check
                label="Pending"
                name="setting-status"
                type="checkbox"
                id="setting-status1"
                onChange={(e) => onSelectStatus(e, "pending")}
              />

              <Form.Check
                label="Paid"
                name="setting-status"
                type="checkbox"
                id="setting-status2"
                onChange={(e) => onSelectStatus(e, "paid")}
              />

              <Form.Check
                label="Expired"
                name="setting-status"
                type="checkbox"
                id="setting-status3"
                onChange={(e) => onSelectStatus(e, "expired")}
              />  */}
            </DropdownButton>
          </div>
          <div className="flex-table-header">
            <div className="transaction-tranx-no">Tranx No</div>
            <div className="transaction-token">Token</div>
            <div className="transaction-amount">Amount</div>
            <div className="transaction-usd-amount">USD Amount</div>
            <div className="transaction-from">Pay from</div>
            <div className="transaction-type">Type</div>
          </div>
          {transactions?.map((transaction) => (
            <div className="flex-table-body" key={transaction?._id}>
              <div className="transaction-tranx-no">
                <div className="tranx-icon">
                  {transaction?.status === "paid" && (
                    <CheckCircleIcon width="32" height="33" />
                  )}
                  {(transaction?.status === "canceled" ||
                    transaction?.status === "expired" ||
                    transaction?.status === "invalid") && (
                    <CloseIcon width="32" height="33" />
                  )}
                  {(transaction?.status === "new" ||
                    transaction?.status === "pending") && (
                    <ExclamationIcon width="32" height="33" />
                  )}
                </div>
                <div>
                  <p className="text-white mb-1">{transaction?.tran_id}</p>
                  <p>
                    {getDateFormate(
                      transaction?.created_at,
                      "MMM DD, YYYY HH:mm:ss"
                    )}
                  </p>
                </div>
              </div>
              <div className="transaction-token">
                <p className="text-white mb-1">
                  {transaction?.token_cryptoAmount <= 200
                    ? formattedNumber(transaction?.token_cryptoAmount)
                    : "+200"}
                </p>
                <p>Token</p>
              </div>
              <div className="transaction-amount">
                <p className="text-white mb-1">
                  {formattedNumber(transaction?.price_amount)}
                </p>
                <p>{transaction?.price_currency}</p>
              </div>
              <div className="transaction-usd-amount">
                <p className="text-white mb-1">
                  {formattedNumber(
                    transaction?.usd_amount
                      ? transaction?.usd_amount
                      : transaction?.price_amount
                  )}
                </p>
                <p>{transaction?.receive_currency}</p>
              </div>
              <div className="transaction-from">
                <p className="text-white mb-1">
                  Pay via {transaction?.price_currency}{" "}
                </p>
                <p>
                  {getDateFormate(
                    transaction?.created_at,
                    "MMM DD, YYYY HH:mm:ss"
                  )}
                </p>
              </div>
              <div className="transaction-type">
                <div className="d-flex justify-content-between align-items-center">
                  <Button variant="outline-success">
                    {transaction.source
                      ? transaction.source.charAt(0).toUpperCase() +
                        transaction.source.slice(1)
                      : "Purchase"}
                  </Button>
                  <ButtonGroup aria-label="Transaction Action">
                    <Button
                      variant="secondary"
                      onClick={(e) => modalToggle(e, transaction)}
                    >
                      <EyeIcon width="24" height="24" />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          ))}
          {totalTransactionsCount === 0 && transactionLoading === false && (
            <div className="flex-table-body no-records justify-content-between">
              <div className="no-records-text">
                <div className="no-record-label">No Records</div>
                <p>You haven't made any transaction</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {totalTransactionsCount !== 0 && transactionLoading === false && (
        <div className="d-flex justify-content-between align-items-center table-pagination">
          <PaginationComponent
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={totalTransactionsCount}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <div className="table-info">
            {currentPage === 1
              ? `${totalTransactionsCount > 0 ? 1 : 0}`
              : `${(currentPage - 1) * PageSize + 1}`}{" "}
            - {`${Math.min(currentPage * PageSize, totalTransactionsCount)}`} of{" "}
            {totalTransactionsCount}
          </div>
        </div>
      )}
      <TransactionDetails
        show={modalShow}
        stateTransactions={stateTransactions}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}

export default Transaction;
