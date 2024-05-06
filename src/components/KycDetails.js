import React from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { getDateFormate, hideAddress } from "../utils";
import listData from "./countryData";
import moment from "moment";

//This component is used for KYC details 
export const KycDetails = (props) => {
  const countryMap = listData.reduce((acc, item) => {
    acc[item.iso] = item.country;
    return acc;
  }, {});
  let foundCountry = null;
  if (props.viewKYC?.user?.location) {
    foundCountry = countryMap[props.viewKYC?.user?.location];
  }
  let formattedDate = null;
  if (props.viewKYC?.user?.dob) {
    formattedDate = moment(props.viewKYC?.user?.dob, "DD/MM/YYYY").format(
      "D MMMM, YYYY"
    );
  }

  return (
    <Modal
      {...props}
      dialogClassName="login-modal"
      backdropClassName="login-modal-backdrop"
      aria-labelledby="contained-modal"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton className="transaction-header">
        <Modal.Title>
          {props?.type === "users" ? "User Detail" : "KYC Detail"}
          {props?.type === "users" && (
            <>
              {props.viewKYC?.user?.status === "Active" && (
                <Button variant="outline-success">Active</Button>
              )}
              {props.viewKYC?.user?.status === "Suspend" && (
                <Button variant="outline-danger suspended-btn">Suspended</Button>
              )}
            </>
          )}
          {props?.type === "kyc" && (
            <>
              {props.viewKYC?.user?.is_verified === 1 && (
                <Button variant="outline-success">Approved</Button>
              )}
              {props.viewKYC?.user?.is_verified === 2 && (
                <Button variant="outline-danger">Rejected</Button>
              )}
              {props.viewKYC?.user?.is_verified === 0 && (
                <Button variant="outline-warning">Pending</Button>
              )}
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="transaction-body">
        {
          <>
            {props.viewKYC?.user?.kyc_submitted_date && (
              <p className="mb-0">
                Submitted By{" "}
                <span className="text-white">
                  {hideAddress(props.viewKYC?.user?.wallet_address, 5)}
                </span>
                , on{" "}
                <span className="text-white">
                  {getDateFormate(props.viewKYC?.user?.kyc_submitted_date)}
                </span>
              </p>
            )}
            {props.viewKYC?.user?.admin_checked_at && (
              <p>
                Checked by <span className="text-white">Admin</span>, on{" "}
                <span className="text-white">
                  {getDateFormate(props.viewKYC?.user?.admin_checked_at)}
                </span>
              </p>
            )}
          </>
        }

        <h3>Personal Information</h3>
        <div className="token-details">
          <Table responsive>
            <tbody>
              <tr>
                <th>First Name</th>
                <td>
                  {props.viewKYC?.user?.fname
                    ? props.viewKYC?.user?.fname
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>Last Name</th>
                <td>
                  {props.viewKYC?.user?.lname
                    ? props.viewKYC?.user?.lname
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>Email Address</th>
                <td>
                  {props.viewKYC?.user?.email
                    ? props.viewKYC?.user?.email
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>
                  {props.viewKYC?.user?.phone && props.viewKYC?.user?.phoneCountry+" "}
                  {props.viewKYC?.user?.phone
                    ? props.viewKYC?.user?.phone
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td> {formattedDate ? formattedDate : "-"}</td>
              </tr>
              <tr>
                <th>Full Address</th>
                <td>
                  {props.viewKYC?.user?.res_address
                    ? props.viewKYC?.user?.res_address
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>Country</th>
                <td>{foundCountry ? foundCountry : "-"}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="d-flex justify-content-between">
          <h3>Upload Documents</h3>
          <h3>
            {props.viewKYC?.user?.verified_with === "government-passport"
              ? "National Id Card"
              : "Driving License"}{" "}
          </h3>
        </div>
        <div className="token-details">
          <Table responsive>
            <tbody>
              <tr>
                <th>Document Image</th>
                <td>User Image</td>
              </tr>
              <tr>
                <th>
                  <div>
                    <img
                      src={
                        props.viewKYC?.passport_url
                          ? props.viewKYC?.passport_url
                          : require("../assets/images/no-image.png")
                      }
                      className="doc-img"
                    />
                  </div>
                </th>
                <td>
                  <div>
                    <img
                      src={
                        props.viewKYC?.user_photo_url
                          ? props.viewKYC?.user_photo_url
                          : require("../assets/images/no-image.png")
                      }
                      className="doc-img"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default KycDetails;
