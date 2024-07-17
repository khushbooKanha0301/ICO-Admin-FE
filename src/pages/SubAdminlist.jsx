import React, { useEffect, useState } from "react";
import { Button, DropdownButton, Form, InputGroup } from "react-bootstrap";
import {
  SearchIcon,
  EyeIcon,
  EditICon,
  TrashIcon,
  SimpleDotedIcon,
} from "../components/SVGIcon";
import AdminsDetails from "../components/AdminsDetails";
import CreateAdmins from "../components/CreateAdmins";
import EditAdminDetails from "../components/EditAdminDetails";
import jwtAxios from "../service/jwtAxios";
import PaginationComponent from "../components/Pagination";
import { notificationFail } from "../store/slices/notificationSlice";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useDispatch } from "react-redux";

let PageSize = 5;

function SubAdmins() {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [admins, setAdmins] = useState(null);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [totalAdminsCount, setTotalAdminsCount] = useState(0);
  const [viewAdmin, setViewAdmins] = useState(null);
  const [searchTrnx, setSearchTrnx] = useState("");
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const modalToggle = (e, admin) => {
    setModalShow(!modalShow);
    setViewAdmins(admin);
  };

  const createToggle = () => {
    setCreateModalShow(!createModalShow);
  };

  const editModalToggle = (id) => {
    jwtAxios
      .get(`/auth/getSubAdminById/${id}`)
      .then((res) => {
        setViewAdmins(res?.data);
        setEditModalShow(!editModalShow);
      })
      .catch((error) => {
        dispatch(notificationFail(error?.response?.data?.message));
      });
  };

  const deleteSubAdmin = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Delete this Admin?",
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
            .get(`/auth/deleteSubAdmin/${id}`)
            .then((res) => {
              Swal.fire("Deleted!", "Sub Admin has been deleted...", "danger");
              getAllAdmins();
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
  
  const getAllAdmins = async () => {
    if (currentPage) {
      await jwtAxios
        .get(
          `/auth/getAllSubAdmins?query=${
            searchTrnx ? searchTrnx : null
          }&page=${currentPage}&pageSize=${PageSize}`
        )
        .then((res) => {
          setAdminsLoading(false);
          setAdmins(res.data?.fetchAllUser);
          setTotalAdminsCount(res.data?.adminsCount);
        })
        .catch((err) => {
          setAdminsLoading(false);
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
      getAllAdmins();
    }
  }, [debouncedSearchValue, isComponentMounted]);

  useEffect(() => {
    getAllAdmins();
    setIsComponentMounted(true);
  }, [currentPage]);

  const setSearchQuery = (e) => {
    setSearchTrnx(e.target.value);
  };

  return (
    <div className="admin-view ">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Admins</h2>
        <Button
          variant="primary"
          className="create-admin-btn"
          onClick={() => createToggle()}
        >
          Create
        </Button>
      </div>
      <div className="table-responsive transition-table">
        <div className="flex-table">
          <div className="flex-table-top">
            <InputGroup>
              <SearchIcon width="32" height="32" />
              <Form.Control
                placeholder="Search-Admins"
                aria-label="Search-Admins"
                aria-describedby="Search-Admins"
                value={searchTrnx}
                onChange={(e) => {
                  setSearchQuery(e);
                }}
              />
            </InputGroup>
          </div>
          <div className="flex-table-header">
            <div className="admins-fname">First Name</div>
            <div className="admins-lname">Last Name</div>
            <div className="admins-username">Usernme</div>
            <div className="admins-ipaddress">Ipaddress</div>
            <div className="admins-status"></div>
          </div>
          {admins?.map((admin) => (
            <>
              <div className="flex-table-body" key={admin?._id}>
                <div className="admins-fname">
                  <p className="text-white mb-1">{admin?.fname}</p>
                </div>
                <div className="admins-lname">
                  <p className="text-white mb-1">{admin?.lname}</p>
                </div>
                <div className="admins-username">
                  <p className="text-white mb-1">{admin?.username}</p>
                </div>
                <div className="admins-ipaddress">
                  <p className="text-white mb-1">{admin?.ipAddress}</p>
                </div>
                <div className="admins-status">
                  <div className="d-flex justify-content-between align-items-center">
                    <DropdownButton
                      id="setting-dropdown"
                      variant="secondary"
                      drop="start"
                      autoClose="outside"
                      title={<SimpleDotedIcon width="20" height="20" />}
                    >
                      <Button
                        variant="link"
                        onClick={(e) => modalToggle(e, admin)}
                      >
                        <EyeIcon width="22" height="22" />
                        View Details
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => editModalToggle(admin?._id)}
                      >
                        <EditICon width="22" height="20" />
                        Edit Details
                      </Button>
                      <>
                        <Button
                          variant="link"
                          onClick={() => deleteSubAdmin(admin?._id)}
                        >
                          <TrashIcon width="22" height="20" />
                          Delete
                        </Button>
                      </>
                    </DropdownButton>
                  </div>
                </div>
              </div>
            </>
          ))}
          {totalAdminsCount === 0 && adminsLoading === false && (
            <div className="flex-table-body no-records justify-content-between">
              <div className="no-records-text">
                <div className="no-record-label">No Records</div>
                <p>You haven't made any transaction</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {totalAdminsCount !== 0 && adminsLoading === false && (
        <div className="d-flex justify-content-between align-items-center table-pagination">
          <PaginationComponent
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={totalAdminsCount}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
      <AdminsDetails
        show={modalShow}
        viewAdmin={viewAdmin}
        onHide={() => setModalShow(false)}
      />
      <CreateAdmins
        show={createModalShow}
        onHide={() => setCreateModalShow(false)}
        getAllAdmins={getAllAdmins}
      />
      <EditAdminDetails
        show={editModalShow}
        viewAdmin={viewAdmin}
        onHide={() => setEditModalShow(false)}
        getAllAdmins={getAllAdmins}
      />
    </div>
  );
}

export default SubAdmins;
