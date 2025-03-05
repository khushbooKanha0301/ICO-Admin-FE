import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import {
  notificationFail,
  notificationSuccess,
} from "../../src/store/slices/notificationSlice";
import jwtAxios from "../../src/service/jwtAxios";
import { getAllPermissions } from "../store/slices/AuthenticationSlice";
import { useDispatch, useSelector } from "react-redux";

//This component is used for edit user details
export const EditAdminDetails = (props) => {
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
        return prevSelectedPermissions.filter(
          (perm) => perm.permission_id !== permissionId
        );
      } else {
        return [
          ...prevSelectedPermissions,
          { permission_id: permissionId, permission_name: permissionName },
        ];
      }
    });
  };

  const isChecked = (permissionId) => {
    return selectedPermissions.some((perm) => perm.permission_id === permissionId);
  };

  useEffect(() => {
    let user = props?.viewAdmin?.fetchUser;
    if (user) {
      setFname(user?.fname ? user?.fname : "");
      setLname(user?.lname ? user?.lname : "");
      setPassword(user?.password ? user?.password : "");
      setUsername(user?.username ? user?.username : "");
      setIpAddress(user?.ipAddress ? user?.ipAddress : "");
      setSelectedPermissions(user?.permissions ? user.permissions : []);
    }
  }, [props?.viewAdmin]);

  const onChange = (e) => {
    if (e.target.name === "fname") {
      setFname(e.target.value);
    } else if (e.target.name === "lname") {
      setLname(e.target.value);
    } else if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    } else if (e.target.name === "ipAddress") {
      setIpAddress(e.target.value);
    }
  };

  const submitHandler = async () => {
    if (!fname) {
      dispatch(notificationFail("Please Enter First Name"));
    } else if (!lname) {
      dispatch(notificationFail("Please Enter Last Name"));
    } else if (!username) {
      dispatch(notificationFail("Please Enter Username"));
    } else if (!ipAddress) {
      dispatch(notificationFail("Please Enter Ip Address"));
    }

    const pattern = /^[a-zA-Z0-9]*$/;
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (
      !fname.match(pattern) ||
      fname.length > 20 ||
      !lname.match(pattern) ||
      lname.length > 20
    ) {
      dispatch(notificationFail("Please enter valid name."));
    }

    if (!username.match(emailPattern) || username.length > 20) {
      dispatch(notificationFail("Please enter valid username."));
    }

    let formSubmit = {
      fname: fname,
      lname: lname,
      username: username,
      ipAddress: ipAddress,
      permissions: selectedPermissions,
    };

    if (password) {
      formSubmit.password = password;
    }

    try {
      let updateUser = await jwtAxios.put(
        `/auth/updateSubAdmins/${props?.viewAdmin?.fetchUser?._id}`,
        formSubmit
      );

      if (updateUser) {
        props.onHide();
        props.getAllAdmins();
        dispatch(notificationSuccess("User details updated successfully !"));
      }
    } catch (error) {
      if (typeof error == "string") {
        dispatch(notificationFail(error));
      }
      if (error?.response?.data?.message === "") {
        dispatch(notificationFail("Invalid "));
      }
      if (error?.response?.data?.message) {
        dispatch(notificationFail(error?.response?.data?.message));
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
        <Modal.Title>Edit User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="edit-user">
        <Form>
          <Row>
            <Col md="12">
              <Form.Group className="form-group">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John"
                  name="fname"
                  value={fname}
                  defaultValue={fname}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Col>
            <Col md="12">
              <Form.Group className="form-group">
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
              <Form.Group className="form-group">
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
              <Form.Group className="form-group">
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
              <Form.Group className="form-group">
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
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditAdminDetails;
