import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import jwtAxios from "../service/jwtAxios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  notificationFail,
  notificationSuccess,
} from "../store/slices/notificationSlice";

//This component is used for reset password 
const ResetPasswordComponent = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = location.state || {};
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email]);

  const resetPassword = async () => {
    const req = {
      newPassword: newPassword,
      confirmPassword: confirmPassword,
      email: email,
    };
    if (!newPassword) {
      dispatch(notificationFail("Please Enter New Password.."));
    } else if (!confirmPassword) {
      dispatch(notificationFail("Please Enter Confirm Password.."));
    } else if (newPassword !== confirmPassword) {
      dispatch(notificationFail("Password and Confirm password Not Matched"));
    } else {
      await jwtAxios
        .post(`/auth/resetPassword`, req)
        .then((res) => {
          dispatch(notificationSuccess(res?.data?.message));
          navigate("/");
        })
        .catch((error) => {
          if(typeof error == "string")
          {
            dispatch(notificationFail(error));
          }else{
            dispatch(notificationFail(error?.response?.data?.message));
            if(error?.response?.data?.message == "Token Expired.")
            {
              navigate("/");
            }
          }
          setConfirmPassword("");
          setNewPassword("");
        });
    }
  };

  return (
    <div className="login-wrapper">
      <Card body className="cards-dark login-container">
        <Card.Title as="h4" className="text-white">
          Forgot Password
        </Card.Title>
        <Form>
          <Row>
            <Col md="12">
              <Form.Group className="form-group mb-3">
                <Form.Label className="text-white">New Password</Form.Label>
                <Form.Control
                  name="newPassword"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  type="password"
                  placeHolder="New Password"
                  autoComplete="current-password"
                />
              </Form.Group>
              <Form.Group className="form-group mb-3">
                <Form.Label className="text-white">Confirm Password</Form.Label>
                <Form.Control
                  name="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  type="password"
                  placeHolder="Confirm Password"
                  autoComplete="current-password"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-between align-items-center">
            <Col xs="auto">
              <Button
                className="login-btn"
                variant="primary"
                onClick={resetPassword}
              >
                Save
              </Button>
              <Button
                className="back-button"
                variant="secondary"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordComponent;
