import React, { useEffect, useState } from "react";
import {
  Button,
  DropdownButton,
  Pagination,
  Modal,
  Nav,
  NavDropdown,
  Navbar,
  Table,
  ButtonGroup,
  InputGroup,
  Form,
} from "react-bootstrap";
import {
  EyeIcon,
  TrashIcon,
  SimpleDotedIcon,
  CheckBoxIcon,
  CancelIcon,
  DownloadIcon,
  SearchIcon,
} from "../components/SVGIcon";
import KYCDetails from "../components/KycDetails";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2/src/sweetalert2.js";
import jwtAxios from "../service/jwtAxios";
import { notificationFail } from "../store/slices/notificationSlice";
import PaginationComponent from "../components/Pagination";
import { hideAddress } from "../utils";

function Kyclist(props) {
  const [modalShow, setModalShow] = useState(false);
  const [transactionType, settransactionType] = useState("");
  const dispatch = useDispatch();
  const [users, setUsers] = useState(null);
  const [viewKYC, setViewKYC] = useState();
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  let PageSize = 5;
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTrnx, setSearchTrnx] = useState(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [kycLoading, setKycLoading] = useState(true);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const getKYC = async () => {
    if (currentPage) {
      await jwtAxios
        .get(
          `/users/kycUserList?query=${
            searchTrnx ? searchTrnx : null
          }&statusFilter=${
            statusFilter ? statusFilter : null
          }&page=${currentPage}&pageSize=${PageSize}`
        )
        .then((res) => {
          setUsers(res.data?.users);
          setTotalUsersCount(res.data?.totalUsersCount);
          setKycLoading(false);
        })
        .catch((err) => {
          setKycLoading(false);
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
  }, [searchTrnx]);

  useEffect(() => {
    if (isComponentMounted) {
      setCurrentPage(1);
      getKYC();
    }
  }, [debouncedSearchValue, statusFilter]);

  useEffect(() => {
    getKYC();
    setIsComponentMounted(true);
  }, [currentPage]);

  const acceptUserKyc = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this KYC application?",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#808080",
      confirmButtonText: "Approve",
    }).then((result) => {
      if (result.isConfirmed) {
        if (id) {
          jwtAxios
            .get(`/users/acceptKyc/${id}`)
            .then((res) => {
              Swal.fire("Approved!", "KYC approved successfully...", "success");
              getKYC();
            })
            .catch((err) => {
              if (typeof err == "string") {
                dispatch(notificationFail(err));
              } else {
                dispatch(notificationFail(err?.response?.data?.message));
              }
            });
        }
      }
    });
  };

  const rejectUserKyc = (id) => {
    Swal.fire({
      title: "Do you want to reject this KYC application?",
      input: "textarea",
      inputLabel: "Rejection Reason sent to Mail",
      inputPlaceholder: "Type reason to reject kyc application...",
      inputAttributes: {
        "aria-label": "Type reason to reject kyc application...",
      },
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "red",
      customClass: {
        popup: "suspend",
      },
      // error: error ? error : null,
    }).then((result) => {
      if (result.isConfirmed) {
        if (id) {
          jwtAxios
            .post(`/users/rejectKyc/${id}`, { message: result.value })
            .then((res) => {
              getKYC();
              Swal.fire("Rejected!", "KYC has been rejected...", "danger");
            })
            .catch((err) => {
              if (typeof err == "string") {
                dispatch(notificationFail(err));
              } else {
                dispatch(notificationFail(err?.response?.data?.message));
              }
            });
        }
      }
    });
  };
  const deleteUserKyc = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Delete this KYC application?",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "#808080",
      confirmButtonText: "Delete",
      customClass: {
        popup: "suspend",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (id) {
          jwtAxios
            .get(`/users/deleteKyc/${id}`)
            .then((res) => {
              if (users.length === 1) {
                setCurrentPage(currentPage - 1);
              }
              getKYC();
              Swal.fire("Deleted!", "KYC has been deleted...", "danger");
            })
            .catch((err) => {
              if (typeof err == "string") {
                dispatch(notificationFail(err));
              } else {
                dispatch(notificationFail(err?.response?.data?.message));
              }
            });
        }
      }
    });
  };

  const handleUserImageDownload = async (id) => {
    let res = await jwtAxios.get(`/users/viewKyc/${id}`).then((res) => {
      return res.data;
    });

    const link = document.createElement("a");
    link.href = res?.user_photo_url;
    link.download = res?.user?.user_photo_url;
    link.click();
  };

  const handlePassportImageDownload = async (id) => {
    let res = await jwtAxios.get(`/users/viewKyc/${id}`).then((res) => {
      return res.data;
    });

    const link = document.createElement("a");
    link.href = res?.passport_url;
    link.download = res?.user?.passport_url;
    link.click();
  };

  const modalToggle = async (e, id) => {
    settransactionType(e);
    jwtAxios
      .get(`/users/viewKyc/${id}`)
      .then((res) => {
        setViewKYC(res?.data);
        setModalShow(!modalShow);
      })
      .catch((error) => {
        dispatch(notificationFail(error?.response?.data?.message));
      });
  };
  const changeStatus = (status) => {
    setStatusFilter(status);
  };

  const setSearchQuery = (e) => {
    setSearchTrnx(e.target.value);
  };
  return (
    <div className="transaction-view">
      <div className="d-flex justify-content-between align-items-center">
        <h2>KYC List</h2>
      </div>
      <div className="table-responsive">
        <div className="flex-table">
          <div className="flex-table-top">
            <ButtonGroup aria-label="filter-btn">
              <Button
                variant="outline-secondary"
                onClick={() => changeStatus("All")}
                className={statusFilter == "All" ? "active" : ""}
              >
                All
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => changeStatus("Pending")}
                className={statusFilter == "Pending" ? "active" : ""}
              >
                Pending
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => changeStatus("Approved")}
                className={statusFilter == "Approved" ? "active" : ""}
              >
                Approved
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => changeStatus("Rejected")}
                className={statusFilter == "Rejected" ? "active" : ""}
              >
                Rejected
              </Button>
            </ButtonGroup>
            <InputGroup>
              <SearchIcon width="32" height="32" />
              <Form.Control
                placeholder="Search Users"
                aria-label="Search-Users"
                aria-describedby="Search-Users"
                value={searchTrnx}
                onChange={(e) => {
                  setSearchQuery(e);
                }}
              />
            </InputGroup>
          </div>
          <div className="flex-table-header">
            <div className="transaction-user">User</div>
            <div className="transaction-doctype">Doc type</div>
            <div className="transaction-documents">Documents</div>
            <div className="transaction-doc-download"></div>
            <div className="transaction-type">Type</div>
          </div>
          {users?.map((item, index) => (
            <div className="flex-table-body" key={index}>
              <div className="transaction-user">
                <div>
                  <p className="text-white mb-2">
                    {item?.fname} {item?.lname}{" "}
                  </p>
                  <p>{hideAddress(item?.wallet_address, 5)}</p>
                </div>
              </div>
              <div className="transaction-doctype">
                <p className="text-white">
                  {item?.verified_with === "government-passport"
                    ? "National Id Card"
                    : "Driving License"}
                </p>
              </div>
              <div className="transaction-documents">
                <p className="text-white mb-2">Document Image</p>
                {item?.passport_url && item?.passport_url !== "" ? (
                  <>
                    <a
                      className="passport-image"
                      style={{ color: "gray", textDecoration: "none", display: "flex" }}
                      onClick={() => handlePassportImageDownload(item?._id)}
                      download
                    >
                      <DownloadIcon width="18" height="18" />
                      Download
                    </a>
                  </>
                ) : (
                  <p>No Image</p>
                )}
              </div>
              <div className="transaction-doc-download">
                <p className="text-white mb-2">User Image</p>
                {item?.user_photo_url && item?.user_photo_url !== "" ? (
                  <>
                    <a
                      className="passport-image"
                      style={{ color: "gray", textDecoration: "none" , display: "flex"}}
                      onClick={() => handleUserImageDownload(item?._id)}
                      download
                    >
                      <DownloadIcon width="18" height="18" />
                      Download
                    </a>
                  </>
                ) : (
                  <p>No Image</p>
                )}
              </div>
              <div className="transaction-type">
                <div className="d-flex justify-content-between align-items-center">
                  {item?.is_verified === 1 && (
                    <Button variant="outline-approved">Approved</Button>
                  )}
                  {item?.is_verified === 2 && (
                    <Button variant="outline-danger">Rejected</Button>
                  )}
                  {item?.is_verified === 0 && (
                    <Button variant="outline-warning">Pending</Button>
                  )}
                  <DropdownButton
                    id="setting-dropdown"
                    variant="secondary"
                    drop="start"
                    autoClose="outside"
                    title={<SimpleDotedIcon width="20" height="20" />}
                  >
                    <Button
                      variant="link"
                      onClick={(e) => modalToggle(e, item?._id)}
                    >
                      <EyeIcon width="22" height="22" />
                      View Details
                    </Button>
                    {item?.is_verified === 0 && (
                      <>
                        <Button
                          variant="link"
                          onClick={() => acceptUserKyc(item?._id)}
                        >
                          <CheckBoxIcon width="22" height="15" />
                          Approve
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => rejectUserKyc(item?._id)}
                        >
                          <CancelIcon width="22" height="16" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {(props.roleId != 2) && (
                      <>
                        <Button
                        variant="link"
                        onClick={() => deleteUserKyc(item?._id)}
                        >
                          <TrashIcon width="22" height="20" />
                          Delete
                        </Button>
                      </>
                    )}
                  </DropdownButton>
                </div>
              </div>
            </div>
          ))}
          {totalUsersCount === 0 && kycLoading === false && (
            <div className="flex-table-body no-records justify-content-between">
              <div className="no-records-text">
                <div className="no-record-label">No Records</div>
                <p>You haven't made any KYC records</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {totalUsersCount !== 0 && kycLoading === false && (
        <div className="d-flex justify-content-between align-items-center table-pagination hiii">
          <PaginationComponent
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={totalUsersCount}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
          {/* <div className="table-info">
            {currentPage === 1
              ? `${totalUsersCount > 0 ? 1 : 0}`
              : `${(currentPage - 1) * PageSize + 1}`}{" "}
            - {`${Math.min(currentPage * PageSize, totalUsersCount)}`} of{" "}
            {totalUsersCount}
          </div> */}
        </div>
      )}
      <KYCDetails
        show={modalShow}
        viewKYC={viewKYC}
        transactiontype={transactionType}
        onHide={() => setModalShow(false)}
        type="kyc"
      />
    </div>
  );
}

export default Kyclist;
