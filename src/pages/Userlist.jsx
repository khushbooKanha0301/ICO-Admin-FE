import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  DropdownButton,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  EyeIcon,
  TrashIcon,
  SimpleDotedIcon,
  CancelIcon,
  DownloadIcon,
  CheckBoxIcon,
  SearchIcon,
  EditICon,
  DisabledIcon,
} from "../components/SVGIcon";
import { KycDetails } from "../components/KycDetails";
import { EditUserDetails } from "../components/EditUserDetails";
import { useDispatch, useSelector } from "react-redux";
import jwtAxios from "../service/jwtAxios";
import Swal from "sweetalert2/src/sweetalert2.js";
import { notificationFail } from "../store/slices/notificationSlice";
import { formattedNumber, getDateFormate, hideAddress } from "../utils";
import PaginationComponent from "../components/Pagination";
import { database, firebaseMessages } from "../config";
import { ref, set } from "@firebase/database";

function Userlist(props) {
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [transactionType, settransactionType] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [setPermissions, setAdminPermissions] = useState([]);
 
  let userId =
    useSelector((state) => state.authenticationReducer?.userId) || null;
  let roleId =
    useSelector((state) => state.authenticationReducer?.roleId) || null;
  roleId = Number(roleId);

  const fetchSubadminById = (id) => {
    jwtAxios
      .get(`/auth/getSubAdminPermission/${id}`)
      .then((res) => {
        setAdminPermissions(res?.data?.fetchUser?.permissions);
      })
      .catch((error) => {
        dispatch(notificationFail(error?.response?.data?.message));
      });
  };

  useEffect(() => {
    if (userId && roleId === 3) {
      fetchSubadminById(userId);
    }
  }, [userId, roleId]);

  const modalToggle = async (e, id) => {
    settransactionType(e);
    jwtAxios
      .get(`/users/viewUser/${id}`)
      .then((res) => {
        setViewKYC(res?.data);
        setModalShow(!modalShow);
      })
      .catch((error) => {
        dispatch(notificationFail(error?.response?.data?.message));
      });
  };

  const editModalToggle = async (e, id) => {
    jwtAxios
      .get(`/users/viewUser/${id}`)
      .then((res) => {
        setViewKYC(res?.data);
        setEditModalShow(!editModalShow);
      })
      .catch((error) => {
        dispatch(notificationFail(error?.response?.data?.message));
      });
  };
  const dispatch = useDispatch();
  const [users, setUsers] = useState(null);
  const [viewKYC, setViewKYC] = useState();
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTrnx, setSearchTrnx] = useState(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  let PageSize = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const getusers = async () => {
    if (currentPage) {
      await jwtAxios
        .get(
          `/users/userList?query=${
            searchTrnx ? searchTrnx : null
          }&statusFilter=${
            statusFilter ? statusFilter : null
          }&page=${currentPage}&pageSize=${PageSize}`
        )
        .then((res) => {
          setUsers(res.data?.users);
          setTotalUsersCount(res.data?.totalUsersCount);
          setUserLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setUserLoading(false);
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
      getusers();
    }
  }, [debouncedSearchValue, statusFilter]);

  useEffect(() => {
    getusers();
    setIsComponentMounted(true);
  }, [currentPage]);

  const activeUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Active this User?",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#808080",
      confirmButtonText: "Active",
    }).then((result) => {
      if (result.isConfirmed) {
        if (id) {
          jwtAxios
            .post(`/users/activeUser/${id}`)
            .then((res) => {
              getusers();
              Swal.fire(
                "Activated!",
                "This User has been Activated...",
                "success"
              );
              set(
                ref(
                  database,
                  firebaseMessages.ICO_USERS + "/" + id + "/is_active"
                ),
                true
              );
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
  const suspendUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Suspend this User?",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "#808080",
      confirmButtonText: "Suspend",
      customClass: {
        popup: "suspend",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (id) {
          jwtAxios
            .post(`/users/suspendUser/${id}`)
            .then((res) => {
              getusers();
              Swal.fire(
                "Suspended!",
                "This User has been Suspended ...",
                "danger"
              );
              set(
                ref(
                  database,
                  firebaseMessages.ICO_USERS + "/" + id + "/is_active"
                ),
                false
              );
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
  const twoFADiasableUser = (id, isSMSCall=0) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to disable this user's ${isSMSCall === 0 ? 'google' : 'sms'} 2FA?`,
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "#808080",
      confirmButtonText: "Disable",
      customClass: {
        popup: "suspend",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (id) {
          jwtAxios
            .post(`/users/${isSMSCall === 0 ? 'twoFADisableUser': 'twoFASMSDisableUser'}/${id}`)
            .then((res) => {
              getusers();
              Swal.fire(
                "Disabled!",
                `This user's ${isSMSCall === 0 ? 'google' : 'sms'} 2FA disabled.`,
                "danger"
              );
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
      text: "Do you want to Delete this User?",
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
            .get(`/users/deleteUser/${id}`)
            .then((res) => {
              if (users.length === 1) {
                setCurrentPage(currentPage - 1);
              }
              getusers();
              Swal.fire("Deleted!", "User has been deleted...", "danger");
              set(
                ref(
                  database,
                  firebaseMessages.ICO_USERS + "/" + id + "/is_delete"
                ),
                true
              );
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

  const changeStatus = (status) => {
    setStatusFilter(status);
  };

  const setSearchQuery = (e) => {
    setSearchTrnx(e.target.value);
  };
  return (
    <div className="transaction-view">
      <div className="d-flex justify-content-between align-items-center">
        <h2>User List</h2>
      </div>
      <div className="table-responsive">
        <div className="flex-table">
          <div className="flex-table-top">
            <ButtonGroup aria-label="filter-btn">
              <Button
                variant="outline-secondary"
                onClick={() => changeStatus("All")}
                className={statusFilter === "All" ? "active" : ""}
              >
                All
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => changeStatus("Active")}
                className={statusFilter === "Active" ? "active" : ""}
              >
                Active
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => changeStatus("Suspend")}
                className={statusFilter === "Suspend" ? "active" : ""}
              >
                Suspend
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
            <div className="transaction-userlist">User</div>
            <div className="transaction-email">Email</div>
            <div className="transaction-tokens">Tokens</div>
            <div className="transaction-verified">Verified Status</div>
            <div className="transaction-lastlogin">Last login</div>
            <div className="transaction-type transaction-usertype"></div>
          </div>
          {users?.map((item, index) => {
            if (item?.last_login) {
              const lastLogin = getDateFormate(item?.last_login);
              var lastLoginDate = lastLogin.split(" ")[0];
              var lastLoginTime =
                lastLogin.split(" ")[1] + " " + lastLogin.split(" ")[2];
            }
            return (
              <div className="flex-table-body" key={index}>
                <div className="transaction-userlist">
                  <div>
                    <p className="text-white mb-2">
                      {" "}
                      {item?.fname} {item?.lname}{" "}
                    </p>
                    <p>{hideAddress(item?.wallet_address, 5)}</p>
                  </div>
                </div>
                <div className="transaction-email">
                  <p className="text-white">{item?.email}</p>
                </div>
                <div className="transaction-tokens">
                  <p className="text-white">
                    {parseFloat(
                      formattedNumber(item?.totalAmount)
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="transaction-verified">
                  <p className="text-white mb-2" style={{ display: "flex" }}>
                    <DownloadIcon width="18" height="18" />
                    Email
                  </p>
                  <p className="text-white" style={{ display: "flex" }}>
                    <DownloadIcon width="18" height="18" />
                    KYC
                  </p>
                </div>
                <div className="transaction-lastlogin">
                  <p className="text-white mb-2">{lastLoginDate}</p>
                  <p>{lastLoginTime}</p>
                </div>
                <div className="transaction-type  transaction-usertype">
                  <div className="d-flex justify-content-between align-items-center">
                    {item?.status === "Active" && (
                      <Button variant="outline-active">Active</Button>
                    )}
                    {item?.status === "Suspend" && (
                      <Button variant="outline-danger">Suspended</Button>
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
                      <Button
                        variant="link"
                        onClick={(e) => editModalToggle(e, item?._id)}
                      >
                        <EditICon width="22" height="20" />
                        Edit Details
                      </Button>
                      {item?.is_2FA_enabled === true && (
                        <Button
                          variant="link"
                          onClick={() => twoFADiasableUser(item?._id, 0)}
                        >
                          <DisabledIcon width="22" height="20" />
                          2FA Disable
                        </Button>
                      )}
                      {item?.is_2FA_SMS_enabled === true && (
                        <Button
                          variant="link"
                          onClick={() => twoFADiasableUser(item?._id, 1)}
                        >
                          <DisabledIcon width="22" height="20" />
                          2FA SMS Disable
                        </Button>
                      )}
                      {item?.status === "Active" && props.roleId == 1 && (
                        <Button
                          variant="link"
                          onClick={() => suspendUser(item?._id)}
                        >
                          <CancelIcon width="22" height="20" />
                          Suspend
                        </Button>
                      )}
                      {setPermissions?.map((permission) => {
                        if (permission.permission_id === 1) {
                          return (
                            <>
                              <Button
                                variant="link"
                                onClick={() => suspendUser(item?._id)}
                              >
                                <CancelIcon width="22" height="20" />
                                Suspend
                              </Button>
                            </>
                          );
                        }
                        return null;
                      })}

                      {item?.status === "Suspend" && (
                        <Button
                          variant="link"
                          onClick={() => activeUser(item?._id)}
                        >
                          <CheckBoxIcon width="22" height="20" />
                          Active
                        </Button>
                      )}
                      {props.roleId == 1 && (
                        <Button
                          variant="link"
                          onClick={() => deleteUserKyc(item?._id)}
                        >
                          <TrashIcon width="22" height="20" />
                          Delete
                        </Button>
                      )}
                      {setPermissions?.map((permission) => {
                        if (permission.permission_id === 2) {
                          return (
                            <>
                              <Button
                                variant="link"
                                onClick={() => deleteUserKyc(item?._id)}
                              >
                                <TrashIcon width="22" height="20" />
                                Delete
                              </Button>
                            </>
                          );
                        }
                        return null;
                      })}
                    </DropdownButton>
                  </div>
                </div>
              </div>
            );
          })}
          {totalUsersCount === 0 && userLoading === false && (
            <div className="flex-table-body no-records justify-content-between">
              <div className="no-records-text">
                <div className="no-record-label">No Records</div>
                <p>You haven't made any user records</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {totalUsersCount !== 0 && userLoading === false && (
        <div className="d-flex justify-content-between align-items-center table-pagination">
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
      <KycDetails
        show={modalShow}
        viewKYC={viewKYC}
        transactiontype={transactionType}
        onHide={() => setModalShow(false)}
        type="users"
      />
      <EditUserDetails
        show={editModalShow}
        viewKYC={viewKYC}
        getusers={getusers}
        onHide={() => setEditModalShow(false)}
      />
    </div>
  );
}

export default Userlist;
