import React from "react";
import { Modal, Table } from "react-bootstrap";

export const AdminDetails = (props) => {
  const renderPermissions = () => {
    if (props.viewAdmin?.permissions && props.viewAdmin.permissions.length > 0) {
      return props.viewAdmin.permissions.map((permission, index) => (
        <span key={permission.permission_id}>
          {permission.permission_name}
          {index !== props.viewAdmin.permissions.length - 1 ? ", " : ""}
        </span>
      ));
    } else {
      return "-";
    }
  };

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
        <Modal.Title>Sub-Admins Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="transaction-body">
        <h3>Personal Information</h3>
        <div className="token-details">
          <Table responsive>
            <tbody>
              <tr>
                <th>First Name</th>
                <td>{props.viewAdmin?.fname ? props.viewAdmin?.fname : "-"}</td>
              </tr>
              <tr>
                <th>Last Name</th>
                <td>{props.viewAdmin?.lname ? props.viewAdmin?.lname : "-"}</td>
              </tr>
              <tr>
                <th>Email Address</th>
                <td>
                  {props.viewAdmin?.username ? props.viewAdmin?.username : "-"}
                </td>
              </tr>
              <tr>
                <th>IP Address</th>
                <td>
                  {props.viewAdmin?.ipAddress
                    ? props.viewAdmin?.ipAddress
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>Permissions</th>
                <td>{renderPermissions()}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AdminDetails;
