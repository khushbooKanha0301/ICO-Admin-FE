import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import {
  notificationFail,
  notificationSuccess,
} from "../../src/store/slices/notificationSlice";
import jwtAxios from "../../src/service/jwtAxios";
import { getAllPermissions } from "../store/slices/AuthenticationSlice";
import { useDispatch, useSelector } from "react-redux";

// This component is used for creating sub-admins
const CreateAdminDetails = (props) => {
  const dispatch = useDispatch();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const { fetchAllpermissions } = useSelector((state) => state?.authenticationReducer);

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    dispatch(getAllPermissions());
  }, []);

  useEffect(() => {
    if (!props.show) {
      // Reset the form when modal is closed
      setFname("");
      setLname("");
      setUsername("");
      setPassword("");
      setIpAddress("");
      setSelectedPermissions([]);
    }
  }, [props.show]);

  const handleCheckboxChange = (permissionId, permissionName) => {
    setSelectedPermissions((prevSelectedPermissions) => {
      const permissionExists = prevSelectedPermissions.some(
        (perm) => perm.permission_id === permissionId
      );
      if (permissionExists) {
        return prevSelectedPermissions.filter((perm) => perm.permission_id !== permissionId);
      } else {
        return [...prevSelectedPermissions, { permission_id: permissionId, permission_name: permissionName }];
      }
    });
  };

  const isChecked = (permissionId) => {
    return selectedPermissions.some((perm) => perm.permission_id === permissionId);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "fname") {
      setFname(value);
    } else if (name === "lname") {
      setLname(value);
    } else if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "ipAddress") {
      setIpAddress(value);
    }
  };

  const submitHandler = async () => {
    try {
      if (!fname || !lname || !username || !password || !ipAddress) {
        dispatch(notificationFail("Please fill in all required fields."));
        return;
      }

      const formSubmit = {
        fname,
        lname,
        username,
        password,
        ipAddress,
        permissions: selectedPermissions,
      };

      const response = await jwtAxios.post(`/auth/createSubAdmins`, formSubmit);

      if (response.data.message) {
        dispatch(notificationSuccess(response.data.message));
        props.onHide();
        // Optionally, fetch all admins again to refresh the list
        props.getAllAdmins();
      }
    } catch (error) {
      if (typeof error === "string") {
        dispatch(notificationFail(error));
      } else if (error?.response?.data?.message) {
        dispatch(notificationFail(error.response.data.message));
      } else {
        dispatch(notificationFail("An error occurred."));
      }
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
        <Modal.Title>Create Sub Admin</Modal.Title>
      </Modal.Header>
      <Modal.Body className="edit-user">
        <Form>
          <Row>
            <Col md="12">
              <Form.Group className="form-group mb-3">
                <Form.Label className="text-white">First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John"
                  name="fname"
                  value={fname}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Col>

            <Col md="12">
              <Form.Group className="form-group mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Doe"
                  name="lname"
                  value={lname}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Col>

            <Col md="12">
              <Form.Group className="form-group mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="username"
                  placeholder="your@email.com"
                  name="username"
                  value={username}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Col>

            <Col md="12">
              <Form.Group className="form-group mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="*******"
                  name="password"
                  value={password}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Col>

            <Col md="12">
              <Form.Group className="form-group mb-3">
                <Form.Label>IP Address</Form.Label>
                <Form.Control
                  type="ipAddress"
                  placeholder="IP Address"
                  name="ipAddress"
                  value={ipAddress}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Col>

            <Col md="12">
              <Form.Group className="form-group">
                <Form.Label>Permissions</Form.Label>
                {fetchAllpermissions?.map((perm) => (
                  <Form.Check
                    key={perm.permission_id}
                    type="checkbox"
                    id={`permission-${perm.permission_id}`}
                    label={perm.permission_name}
                    checked={isChecked(perm.permission_id)}
                    onChange={() =>
                      handleCheckboxChange(
                        perm.permission_id,
                        perm.permission_name
                      )
                    }
                  />
                ))}
              </Form.Group>
            </Col>
          </Row>

          <Button
            variant="primary"
            onClick={submitHandler}
            className="edit-user-btn"
          >
            Create
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateAdminDetails;
