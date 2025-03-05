import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  notificationFail,
  notificationSuccess,
} from "../store/slices/notificationSlice";
import jwtAxios from "../service/jwtAxios";
import ForgotPasswordOTP from "../components/ForgotPasswordOTP";
import { useNavigate } from "react-router-dom";

//this component is used for forget password
const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState("admin@middn.com");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openModal = async () => {
    const req = { userName: email };
    if (!email) {
      dispatch(notificationFail("Please Enter Email.."));
    } else {
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false);
      }, 5000);
      await jwtAxios
        .post(`/auth/forgotpassword`, { email: req?.userName })
        .then((res) => {
          dispatch(notificationSuccess(res?.data?.message));
          setIsModalOpen(true);
        })
        .catch((error) => {
          if(typeof error == "string")
          {
            dispatch(notificationFail(error));
          }else{
            dispatch(notificationFail(error?.response?.data?.message));
          }
        });
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
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
                <Form.Label className="text-white">Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Enter Email"
                  autoComplete="username"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-between align-items-center">
            <Col xs="auto">
              <Button
                className="login-btn"
                variant="primary"
                onClick={() => openModal()}
                disabled={isDisabled}
              >
                Send
              </Button>
              <Button
                className="back-button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <ForgotPasswordOTP
        isOpen={isModalOpen}
        onClose={closeModal}
        email={email}
      />
    </div>
  );
};

export default ForgotPasswordComponent;
