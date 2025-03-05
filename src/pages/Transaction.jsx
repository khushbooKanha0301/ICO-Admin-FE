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
import { formattedNumber, getDateFormate } from "../utils";
import PaginationComponent from "../components/Pagination";

function Transaction(props) {
  const { setCurrentPage , transactionLoading, transactions , totalTransactionsCount, isTypeChecked , setIsTypeChecked, isStatusChecked,
    setIsStatusChecked, setSearchTrnx, setStatusFilter, statusFilter, searchTrnx, gettransaction , currentPage, PageSize
  } = props
  const [modalShow, setModalShow] = useState(false);
 
  const [stateTransactions, setStateTransactions] = useState(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
 
  const modalToggle = (e, transaction) => {
    setModalShow(!modalShow);
    setStateTransactions(transaction);
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
      gettransaction(isTypeChecked, isStatusChecked);
    }
  }, [debouncedSearchValue, statusFilter, isTypeChecked, isStatusChecked, isComponentMounted]);

  useEffect(() => {
    gettransaction(isTypeChecked, isStatusChecked);
    setIsComponentMounted(true);
  }, [currentPage, isTypeChecked, isStatusChecked]);

  const setSearchQuery = (e) => {
    setSearchTrnx(e.target.value);
  };
  const changeStatus = (status) => {
    setStatusFilter(status);
  };

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
                onClick={() => changeStatus("failed")}
                className={statusFilter === "failed" ? "active" : ""}
                variant="outline-secondary"
              >
                Failed
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
                onClick={() => handleFilterStatusChange("failed")}
              >
                <div
                  className={`form-check-input ${
                    isStatusChecked.includes("failed") ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">Failed</label>
              </div>
            </DropdownButton>
          </div>
          <div className="flex-table-header">
            <div className="transaction-tranx-no">Tranx No</div>
            <div className="transaction-usd-amount">USDT Amount</div>
            <div className="transaction-token">Token</div>
            <div className="transaction-amount">Network</div>
            <div className="transaction-from">Pay from</div>
            <div className="transaction-web-type">Type</div>
            <div className="transaction-status">Status</div>
          </div>
          {transactions?.map((transaction) => (
            <div className="flex-table-body" key={transaction?._id}>
              <div className="transaction-tranx-no">
                <div className="tranx-icon">
                  {transaction?.status == "paid" && (
                    <CheckCircleIcon width="32" height="33" />
                  )}
                  {transaction?.status == "failed" && (
                    <CloseIcon width="32" height="33" />
                  )}
                  {transaction?.status == "pending" && (
                    <ExclamationIcon width="30" height="29" />
                  )}
                </div>
                <div>
                  <p className="text-white mb-1">{transaction?._id}</p>
                  <p>
                    {getDateFormate(
                      transaction?.created_at,
                      "MMM DD, YYYY HH:mm:ss"
                    )}
                  </p>
                </div>
              </div>
              <div className="transaction-usd-amount">
                <p className="text-white mb-1">
                  {formattedNumber(
                    transaction?.price_amount
                  )}
                </p>
              </div>
              <div className="transaction-token">
                <p className="text-white mb-1">
                  {transaction?.is_sale && transaction?.is_process ? transaction?.token_cryptoAmount <= 200
                    ? formattedNumber(transaction?.token_cryptoAmount)
                    : "+200" : "0.00" }
                </p>
              </div>
              <div className="transaction-amount">
                <p className="text-white mb-1">
                {transaction?.network}
                </p>
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
              <div className="transaction-web-type">
                <div className="d-flex justify-content-between align-items-center">
                  {transaction?.sale_type == "website" ? "Website": "Outside-Web"}
                </div>
              </div>
              <div className="transaction-status">
                <div className="d-flex justify-content-between align-items-center">
                  {transaction?.status == "paid" && (
                    <Button variant="outline-success">
                      Confirmed 
                    </Button>
                  )}
                  {transaction?.status == "failed" && (
                    <Button variant="outline-danger">
                      Failed 
                    </Button>                  
                  )}
                  {transaction?.status == "pending" && (
                    <Button variant="outline-pending">
                      Unconfirmed 
                    </Button>
                  )}

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
